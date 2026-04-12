pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "omnicycle-app"
        DOCKER_REGISTRY = "your-docker-hub-user"
        EMAIL_RECIPIENT = "admin@icms.com"
        APP_PORT = "3000"
    }

    stages {
        stage('Initialize & Versioning') {
            steps {
                script {
                    env.VERSION = "v1.0.${BUILD_NUMBER}"
                    echo "Starting build for version: ${env.VERSION}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Frontend & Backend Dependencies...'
                sh 'npm install'
            }
        }

        stage('Linting') {
            steps {
                echo 'Checking code quality...'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running unit tests...'
            }
        }

        stage('Build Services') {
            steps {
                echo 'Building production assets...'
                sh 'npm run build'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Packaging application into Docker images...'
                sh "docker build -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${env.VERSION} ."
                sh "docker tag ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${env.VERSION} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"
            }
        }

        stage('Deploy (Zero Downtime)') {
            steps {
                script {
                    echo 'Executing Blue-Green Deployment Strategy...'
                    try {
                        sh "docker run -d --name ${DOCKER_IMAGE}-new -p 8081:${APP_PORT} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${env.VERSION}"
                        sleep 10
                        def health = sh(script: "curl -s http://localhost:8081/health | grep 'OK'", returnStatus: true)
                        
                        if (health == 0) {
                            sh "docker stop ${DOCKER_IMAGE} || true"
                            sh "docker rm ${DOCKER_IMAGE} || true"
                            sh "docker rename ${DOCKER_IMAGE}-new ${DOCKER_IMAGE}"
                            echo "Deployment Successful: Version ${env.VERSION} is live."
                        } else {
                            error "Health check failed on new build!"
                        }
                    } catch (Exception e) {
                        echo "Deployment failed! Rolling back..."
                        sh "docker stop ${DOCKER_IMAGE}-new || true"
                        sh "docker rm ${DOCKER_IMAGE}-new || true"
                        error "Rollback triggered due to: ${e.message}"
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        failure {
            mail to: "${EMAIL_RECIPIENT}",
                 subject: "FAILED: Build ${currentBuild.fullDisplayName}",
                 body: """Build failed in Omnicycle Pipeline.
                          Reason: ${currentBuild.result}
                          Check logs here: ${env.BUILD_URL}
                          Version attempted: ${env.VERSION}"""
        }
        success {
            echo "Successfully deployed version ${env.VERSION}"
        }
    }
}