pipeline {
    agent any

    environment {
        IMAGE_NAME     = "nodejs-docker-jenkins"
        CONTAINER_NAME = "nodejs-docker-jenkins"
        HOST_PORT      = "3000"
        APP_PORT       = "3000"
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Test') {
            steps {
                sh '''
                  node --version
                  npm ci
                  npm test
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                  docker stop ${CONTAINER_NAME} || true
                  docker rm ${CONTAINER_NAME} || true

                  docker run -d \
                    --name ${CONTAINER_NAME} \
                    -p ${HOST_PORT}:${APP_PORT} \
                    --restart unless-stopped \
                    ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }

        stage('Smoke Test') {
            steps {
                sh '''
                  echo "Waiting for the container to become healthy..."
                  for i in $(seq 1 15); do
                    if curl -fs http://localhost:${HOST_PORT}/health > /dev/null; then
                      echo "Health check passed."
                      curl -s http://localhost:${HOST_PORT}/health
                      exit 0
                    fi
                    sleep 2
                  done
                  echo "Application did not become healthy in time."
                  docker logs ${CONTAINER_NAME}
                  exit 1
                '''
            }
        }
    }

    post {
        success {
            echo "Build ${IMAGE_TAG} deployed successfully on port ${HOST_PORT}."
        }
        failure {
            echo "Build ${IMAGE_TAG} failed. Check the stage log above."
        }
        always {
            sh 'docker image prune -f || true'
        }
    }
}
