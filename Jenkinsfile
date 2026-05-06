pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  environment {
    GITEA_REGISTRY = "gitea.kltn.internal:80"
    GITEA_OWNER = "kltn"
    GITEA_CREDS_ID = "gitea-token-admin"

    SONAR_SERVER = "sonar-server"
    SONAR_SCANNER = "sonar-scanner"

    GIT_USER_NAME = "thanhdc"
    GIT_USER_EMAIL = "chithanh040804@gmail.com"
    MANIFEST_REPO_URL = "http://gitea.kltn.internal/KLTN/healthcare-manifests.git"
    MANIFEST_REPO_BRANCH = "main"
  }

  parameters {
    string(
      name: 'RELEASE_TAG',
      defaultValue: '',
      description: 'Release tag for production (leave empty for staging)'
    )
  }

  stages {
    stage('System Information') {
      steps {
        sh '''
          echo "=== CPU ===" && lscpu | grep -E "Model|Socket|Core|Thread" || true
          echo "=== RAM ===" && free -mh
          echo "=== Disk ===" && df -h
          echo "=== Docker ===" && docker version --format "Client: {{.Client.Version}}  Server: {{.Server.Version}}"
        '''
      }
    }

    stage('Checkout') {
      steps {
        checkout scm
        script {
          env.SHORT_SHA = sh(script: 'git rev-parse --short=8 HEAD', returnStdout: true).trim()
          echo "Branch: ${env.BRANCH_NAME ?: 'N/A'} | Commit: ${env.GIT_COMMIT?.take(8) ?: 'N/A'}"
        }
      }
    }

    stage('Detect Changes') {
      steps {
        script {
          def allServices = ['frontend', 'auth', 'backend', 'admin']
          def services = [] as LinkedHashSet

          def baseCommit = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT ?: env.GIT_PREVIOUS_COMMIT
          if (!baseCommit) {
            try {
              baseCommit = sh(script: 'git rev-parse HEAD~1', returnStdout: true).trim()
            } catch (ignored) {
              baseCommit = null
            }
          }

          if (!baseCommit) {
            services.addAll(allServices)
          } else {
            def diffOutput = sh(
              script: "git diff --name-only ${baseCommit} ${env.GIT_COMMIT}",
              returnStdout: true
            ).trim()
            def changedFiles = diffOutput ? diffOutput.split('\n') as List : []

            changedFiles.each { filePath ->
              if (filePath.startsWith('frontend/')) {
                services.add('frontend')
              }

              if (filePath.startsWith('backend/apps/auth/')) {
                services.add('auth')
              }

              if (filePath.startsWith('backend/apps/backend/')) {
                services.add('backend')
              }

              if (filePath.startsWith('backend/apps/admin/')) {
                services.add('admin')
              }

              if (
                filePath.startsWith('backend/src/') ||
                filePath.startsWith('backend/libs/') ||
                filePath.startsWith('backend/prisma/') ||
                filePath == 'backend/Dockerfile' ||
                filePath == 'backend/package.json' ||
                filePath == 'backend/pnpm-lock.yaml' ||
                filePath == 'backend/tsconfig.json' ||
                filePath == 'backend/tsconfig.build.json' ||
                filePath == 'backend/nest-cli.json'
              ) {
                services.addAll(['auth', 'backend', 'admin'])
              }
            }

            if (services.isEmpty()) {
              echo 'No deployable service changes detected.'
            }
          }

          env.CHANGED_SERVICES = services.join(',')
          env.DEPLOY_TAG = params.RELEASE_TAG?.trim() ? params.RELEASE_TAG.trim() : env.SHORT_SHA

          echo "Changed services: ${env.CHANGED_SERVICES ?: 'none'}"
          echo "Deploy tag: ${env.DEPLOY_TAG}"
        }
      }
    }

    stage('Security & Quality Analysis') {
      parallel {
        stage('SonarQube Scan') {
          steps {
            script {
              def scannerHome = tool SONAR_SCANNER
              withSonarQubeEnv(SONAR_SERVER) {
                sh """
                  ${scannerHome}/bin/sonar-scanner \
                    -Dsonar.projectKey=${env.JOB_BASE_NAME} \
                    -Dsonar.sources=.
                """
              }
            }
          }
        }

        stage('Dockerfile Lint (Hadolint)') {
          steps {
            script {
              sh '''
                docker run --rm -i hadolint/hadolint:v2.14.0 hadolint \
                  --failure-threshold style \
                  - < ./frontend/Dockerfile || true
                docker run --rm -i hadolint/hadolint:v2.14.0 hadolint \
                  --failure-threshold style \
                  - < ./backend/Dockerfile || true
              '''
            }
          }
        }

        stage('Vulnerability Scan (Trivy)') {
          steps {
            script {
              sh """
                docker run --rm \
                  -v /var/run/docker.sock:/var/run/docker.sock \
                  -v \${HOME}/.cache/trivy:/root/.cache/trivy \
                  aquasec/trivy:0.69.3 fs \
                    --scanners vuln,secret \
                    --severity HIGH,CRITICAL \
                    --exit-code 0 \
                    --no-progress \
                    .
              """
            }
          }
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: false
        }
      }
    }

    stage('Build & Push Images') {
      when {
        expression { return env.CHANGED_SERVICES?.trim() }
      }
      steps {
        script {
          dockerLogin()

          env.CHANGED_SERVICES.split(',').each { serviceName ->
            def imageName = serviceImageName(serviceName)
            if (serviceName == 'frontend') {
              sh "docker build -f frontend/Dockerfile -t ${imageName}:${env.DEPLOY_TAG} frontend"
            } else {
              sh "docker build -f backend/Dockerfile --build-arg APP_NAME=${serviceName} -t ${imageName}:${env.DEPLOY_TAG} backend"
            }
            sh "docker push ${imageName}:${env.DEPLOY_TAG}"
          }
        }
      }
    }

    stage('Staging Deployment') {
      when {
        allOf {
          branch 'main'
          expression { return !params.RELEASE_TAG?.trim() }
          expression { return env.CHANGED_SERVICES?.trim() }
        }
      }
      steps {
        script {
          updateManifests(
            environment: 'staging',
            services: env.CHANGED_SERVICES.split(','),
            imageTag: env.DEPLOY_TAG,
            branch: MANIFEST_REPO_BRANCH,
            commitMessage: "ci(staging): update healthcare images to ${env.DEPLOY_TAG}"
          )
        }
      }
    }

    stage('Production Release') {
      when {
        allOf {
          expression { return params.RELEASE_TAG?.trim() }
          expression { return env.CHANGED_SERVICES?.trim() }
        }
      }
      stages {
        stage('Create Git Tag') {
          steps {
            script {
              echo "Starting production release for: ${params.RELEASE_TAG}"
              withCredentials([string(credentialsId: "${GITEA_CREDS_ID}", variable: 'TOKEN')]) {
                sh """
                  set -e
                  git config user.name "${GIT_USER_NAME}"
                  git config user.email "${GIT_USER_EMAIL}"
                  git tag ${params.RELEASE_TAG}
                  git push http://${GIT_USER_NAME}:\${TOKEN}@gitea.kltn.internal/kltn/healthcare.git ${params.RELEASE_TAG}
                """
              }
            }
          }
        }

        stage('Build Production Images') {
          steps {
            script {
              dockerLogin()

              env.CHANGED_SERVICES.split(',').each { serviceName ->
                def imageName = serviceImageName(serviceName)
                if (serviceName == 'frontend') {
                  sh "docker build -f frontend/Dockerfile -t ${imageName}:${env.DEPLOY_TAG} frontend"
                } else {
                  sh "docker build -f backend/Dockerfile --build-arg APP_NAME=${serviceName} -t ${imageName}:${env.DEPLOY_TAG} backend"
                }
                sh "docker push ${imageName}:${env.DEPLOY_TAG}"
              }
            }
          }
        }

        stage('Create Gitea Release') {
          steps {
            script {
              echo "Creating official release on Gitea for tag: ${params.RELEASE_TAG}"
              withCredentials([string(credentialsId: "${GITEA_CREDS_ID}", variable: 'TOKEN')]) {
                sh '''
                  set -e
                  RELEASE_PAYLOAD=$(printf '{"tag_name":"%s","name":"Release %s","body":"Production release %s automatically built and pushed by Jenkins."}' \
                    "${RELEASE_TAG}" "${RELEASE_TAG}" "${RELEASE_TAG}")

                  curl --silent --show-error --fail-with-body \
                    -X POST "http://gitea.kltn.internal/api/v1/repos/kltn/healthcare/releases" \
                    -H "accept: application/json" \
                    -H "Authorization: token ${TOKEN}" \
                    -H "Content-Type: application/json" \
                    --data "${RELEASE_PAYLOAD}"

                  echo "Gitea release created successfully"
                '''
              }
            }
          }
        }

        stage('Create Production PR') {
          steps {
            script {
              createProductionPR(
                releaseTag: params.RELEASE_TAG,
                services: env.CHANGED_SERVICES.split(','),
                imageTag: env.DEPLOY_TAG
              )
            }
          }
        }
      }
    }
  }

  post {
    always {
      script {
        echo 'Post-build cleanup'
        sh "docker logout ${GITEA_REGISTRY} || true"
        sh "docker image prune -f || true"
        sh "docker builder prune -f || true"
        cleanWs()
      }
    }

    success {
      echo 'Pipeline completed successfully'
    }

    failure {
      echo 'Pipeline failed - review stage logs for details'
    }
  }
}

def dockerLogin() {
  withCredentials([string(credentialsId: "${GITEA_CREDS_ID}", variable: 'TOKEN')]) {
    sh """
      echo "\$TOKEN" | docker login ${GITEA_REGISTRY} \
        --username admin --password-stdin
    """
  }
}

def serviceImageName(String serviceName) {
  return "${GITEA_REGISTRY}/${GITEA_OWNER}/healthcare-${serviceName}"
}

def manifestOverlayPath(String environment, String serviceName) {
  def basePath = "apps/overlays/${environment}"
  def overlayMap = [
    frontend: "${basePath}/frontend/kustomization.yaml",
    auth: "${basePath}/auth-service/kustomization.yaml",
    backend: "${basePath}/backend-service/kustomization.yaml",
    admin: "${basePath}/admin-service/kustomization.yaml",
  ]

  return overlayMap[serviceName]
}

def updateImageReference(String filePath, String imageName, String imageTag) {
  def fileContent = readFile(file: filePath)
  fileContent = fileContent.replaceAll(/(?m)^(\s*newName:\s*).*$/, '$1' + imageName)
  fileContent = fileContent.replaceAll(/(?m)^(\s*newTag:\s*).*$/, '$1"' + imageTag + '"')
  writeFile file: filePath, text: fileContent
}

def updateManifests(Map config) {
  dir('manifests-workspace') {
    withCredentials([string(credentialsId: "${GITEA_CREDS_ID}", variable: 'TOKEN')]) {
      sh """
        set -e
        GIT_REPO_URL="http://${GIT_USER_NAME}:\${TOKEN}@gitea.kltn.internal/kltn/healthcare-manifests.git"
        git clone "\${GIT_REPO_URL}" .
        git checkout ${config.branch}
      """

      config.services.each { serviceName ->
        def filePath = manifestOverlayPath(config.environment, serviceName)
        if (!filePath) {
          echo "No manifest mapping for service: ${serviceName}"
          return
        }

        updateImageReference(filePath, serviceImageName(serviceName), config.imageTag)
      }

      sh "git add ."
      sh "git status --porcelain"
      sh "git -c user.name=\"${GIT_USER_NAME}\" -c user.email=\"${GIT_USER_EMAIL}\" commit -m \"${config.commitMessage}\" || echo 'No changes to commit'"
      sh "git push origin ${config.branch}"
    }
  }
}

def createProductionPR(Map config) {
  dir('manifests-workspace') {
    withCredentials([string(credentialsId: "${GITEA_CREDS_ID}", variable: 'TOKEN')]) {
      sh """
        set -e
        if [ -z "${config.releaseTag}" ]; then
          echo "Error: Release tag not provided" >&2
          exit 1
        fi

        GIT_REPO_URL="http://${GIT_USER_NAME}:\${TOKEN}@gitea.kltn.internal/kltn/healthcare-manifests.git"
        git clone "\${GIT_REPO_URL}" .

        TEMP_BRANCH="release-prod-${config.releaseTag}"
        git checkout -b \${TEMP_BRANCH}
      """

      config.services.each { serviceName ->
        def filePath = manifestOverlayPath('production', serviceName)
        if (!filePath) {
          echo "No manifest mapping for service: ${serviceName}"
          return
        }

        updateImageReference(filePath, serviceImageName(serviceName), config.imageTag)
      }

      sh "git add ."
      sh "git -c user.name=\"${GIT_USER_NAME}\" -c user.email=\"${GIT_USER_EMAIL}\" commit -m \"chore(prod): update healthcare images to ${config.imageTag}\" || echo 'No changes to commit'"
      sh "git push origin release-prod-${config.releaseTag}"

      sh """
        PR_PAYLOAD=\$(printf '{"base":"main","head":"%s","title":"Deploy to Production: %s","body":"Release %s - image tag %s"}' \
          "release-prod-${config.releaseTag}" "${config.releaseTag}" "${config.releaseTag}" "${config.imageTag}")

        curl --silent --show-error --fail-with-body \
          -X POST "http://gitea.kltn.internal/api/v1/repos/kltn/healthcare-manifests/pulls" \
          -H "accept: application/json" \
          -H "Authorization: token \${TOKEN}" \
          -H "Content-Type: application/json" \
          --data "\${PR_PAYLOAD}"
      """
    }
  }
}