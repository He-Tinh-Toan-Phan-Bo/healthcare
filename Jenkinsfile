pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  environment {
    // Registry Configuration
    GITEA_REGISTRY = "gitea.kltn.internal:80"
    GITEA_OWNER = "kltn"
    GITEA_CREDS_ID = "gitea-token-admin"

    // SonarQube Configuration
    SONAR_SERVER = "sonar-server"
    SONAR_SCANNER = "sonar-scanner"

    // Git Configuration
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
        echo "Branch: ${env.BRANCH_NAME ?: 'N/A'} | Commit: ${env.GIT_COMMIT?.take(8) ?: 'N/A'}"
      }
    }

    stage('Detect Changes') {
      steps {
        script {
          def shortSha = sh(script: 'git rev-parse --short=8 HEAD', returnStdout: true).trim()
          env.SHORT_SHA = shortSha

          def baseCommit = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT ?: env.GIT_PREVIOUS_COMMIT
          def services = [] as Set

          if (!baseCommit) {
            services.addAll(['frontend', 'auth', 'backend', 'admin'])
          } else {
            def diffOutput = sh(script: "git diff --name-only ${baseCommit} ${env.GIT_COMMIT}", returnStdout: true).trim()
            def changedFiles = diffOutput ? diffOutput.split('\n') : []

            def backendSharedPrefixes = [
              'backend/libs/',
              'backend/src/',
              'backend/prisma/',
              'backend/Dockerfile',
              'backend/package.json',
              'backend/pnpm-lock.yaml',
              'backend/tsconfig.json',
              'backend/tsconfig.build.json',
              'backend/nest-cli.json'
            ]

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

              if (backendSharedPrefixes.any { prefix -> filePath.startsWith(prefix) }) {
                services.addAll(['auth', 'backend', 'admin'])
              }
            }
          }

          env.CHANGED_SERVICES = services.join(',')
          echo "Short SHA: ${env.SHORT_SHA}"
          echo "Changed services: ${env.CHANGED_SERVICES}"
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

    stage('Build & Push') {
      when {
        expression {
          return env.CHANGED_SERVICES?.trim()
        }
      }
      steps {
        script {
          def services = env.CHANGED_SERVICES.split(',')
          dockerLogin()

          services.each { serviceName ->
            def imageName = "${env.GITEA_REGISTRY}/${env.GITEA_OWNER}/healthcare-${serviceName}"
            if (serviceName == 'frontend') {
              sh "docker build -f frontend/Dockerfile -t ${imageName}:${env.SHORT_SHA} frontend"
            } else {
              sh "docker build -f backend/Dockerfile --build-arg APP_NAME=${serviceName} -t ${imageName}:${env.SHORT_SHA} backend"
            }
            sh "docker push ${imageName}:${env.SHORT_SHA}"
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
            imageTag: env.SHORT_SHA,
            branch: env.MANIFEST_REPO_BRANCH,
            commitMessage: "ci(staging): update image tags to ${env.SHORT_SHA}"
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
                  git config user.name "${GIT_USER_NAME}"
                  git config user.email "${GIT_USER_EMAIL}"
                  git tag ${params.RELEASE_TAG}
                  git push http://${GIT_USER_NAME}:
                    \${TOKEN}@gitea.kltn.internal/kltn/healthcare.git ${params.RELEASE_TAG}
                """
              }
            }
          }
        }

        stage('Create Production PR') {
          steps {
            script {
              createProductionPR(
                releaseTag: params.RELEASE_TAG,
                imageTag: env.SHORT_SHA
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
        sh "docker logout ${GITEA_REGISTRY} || true"
        sh "docker image prune -f || true"
        sh "docker builder prune -f || true"
        cleanWs()
      }
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

def updateManifests(Map config) {
  def services = env.CHANGED_SERVICES?.trim() ? env.CHANGED_SERVICES.split(',') : []
  def overlayMap = [
    frontend: 'apps/overlays/staging/frontend/kustomization.yaml',
    auth: 'apps/overlays/staging/auth-service/kustomization.yaml',
    backend: 'apps/overlays/staging/backend-service/kustomization.yaml',
    admin: 'apps/overlays/staging/admin-service/kustomization.yaml'
  ]

  dir('manifests-workspace') {
    withCredentials([string(credentialsId: "${GITEA_CREDS_ID}", variable: 'TOKEN')]) {
      sh """
        set -e
        GIT_REPO_URL="http://${GIT_USER_NAME}:\${TOKEN}@gitea.kltn.internal/kltn/healthcare-manifests.git"
        git clone "\${GIT_REPO_URL}" .
        git checkout ${config.branch}
      """

      services.each { serviceName ->
        def filePath = overlayMap[serviceName]
        if (!filePath) {
          echo "No manifest mapping for service: ${serviceName}"
          return
        }

        def imageName = "${GITEA_REGISTRY}/${GITEA_OWNER}/healthcare-${serviceName}"
        sh "python3 - <<'PY'\nfrom pathlib import Path\nimport re\npath = Path('${filePath}')\ntext = path.read_text()\ntext = re.sub(r'(?m)^(\\s*newName:\\s*).*$','\\1${imageName}', text)\ntext = re.sub(r'(?m)^(\\s*newTag:\\s*).*$','\\1\"${config.imageTag}\"', text)\npath.write_text(text)\nprint(f'Updated {path}')\nPY"
      }

      sh "git add ."
      sh "git status --porcelain"
      sh "git -c user.name=\"${GIT_USER_NAME}\" -c user.email=\"${GIT_USER_EMAIL}\" commit -m \"${config.commitMessage}\" || echo 'No changes to commit'"
      sh "git push origin ${config.branch}"
    }
  }
}

def createProductionPR(Map config) {
  def services = env.CHANGED_SERVICES?.trim() ? env.CHANGED_SERVICES.split(',') : []
  def overlayMap = [
    frontend: 'apps/overlays/production/frontend/kustomization.yaml',
    auth: 'apps/overlays/production/auth-service/kustomization.yaml',
    backend: 'apps/overlays/production/backend-service/kustomization.yaml',
    admin: 'apps/overlays/production/admin-service/kustomization.yaml'
  ]

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

      services.each { serviceName ->
        def filePath = overlayMap[serviceName]
        if (!filePath) {
          echo "No manifest mapping for service: ${serviceName}"
          return
        }

        def imageName = "${GITEA_REGISTRY}/${GITEA_OWNER}/healthcare-${serviceName}"
        sh "python3 - <<'PY'\nfrom pathlib import Path\nimport re\npath = Path('${filePath}')\ntext = path.read_text()\ntext = re.sub(r'(?m)^(\\s*newName:\\s*).*$','\\1${imageName}', text)\ntext = re.sub(r'(?m)^(\\s*newTag:\\s*).*$','\\1\"${config.imageTag}\"', text)\npath.write_text(text)\nprint(f'Updated {path}')\nPY"
      }

      sh "git add ."
      sh "git -c user.name=\"${GIT_USER_NAME}\" -c user.email=\"${GIT_USER_EMAIL}\" commit -m \"chore(prod): update image tags to ${config.imageTag}\""
      sh "git push origin \${TEMP_BRANCH}"

      sh """
        PR_PAYLOAD=\$(printf '{"base":"main","head":"%s","title":"Deploy to Production: %s","body":"Release %s - image tag %s"}' \\
          "\${TEMP_BRANCH}" "${config.releaseTag}" "${config.releaseTag}" "${config.imageTag}")

        curl --silent --show-error --fail-with-body \\
          -X POST "http://gitea.kltn.internal/api/v1/repos/kltn/healthcare-manifests/pulls" \\
          -H "accept: application/json" \\
          -H "Authorization: token \${TOKEN}" \\
          -H "Content-Type: application/json" \\
          --data "\${PR_PAYLOAD}"
      """
    }
  }
}
