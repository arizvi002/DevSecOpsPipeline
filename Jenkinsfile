pipeline {
    agent { label 'slave' }

    environment {
        ECR_URI = '060849198576.dkr.ecr.us-west-2.amazonaws.com/dev_sec_ops_app'
        AWS_REGION = 'us-west-2' // Replace with your AWS region
    }
    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']], // Ensure the correct branch
                    userRemoteConfigs: [[url: 'https://github.com/arizvi002/DevSecOpsPipeline.git']],
                    extensions: [[$class: 'WipeWorkspace']] // Cleans up the workspace
                ])
            }
            }
        stage('Build') {
            steps {
                // Build Docker image
                sh 'ls'
                sh 'docker build -t my-app:latest .'
            }
        }
        stage('Test') {
            steps {
                // Run application tests
                sh 'npm test'
            }
        }
        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube') { // Replace 'SonarQubeServer' with your SonarQube server name
                    sh '''
                    ${scannerHome}/bin/sonar-scanner \
                    -Dsonar.projectKey=DevSecOpsApp \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=$SONAR_HOST_URL \
                    -Dsonar.login=$SONAR_AUTH_TOKEN
                    '''
                }
            }
        }
        stage('Push to ECR') {
            steps {
                // Login to Amazon ECR and push the Docker image
                sh '''
                aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}
                aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 060849198576.dkr.ecr.us-west-2.amazonaws.com
                docker tag my-app:latest ${ECR_URI}:latest
                docker push ${ECR_URI}:latest
                '''
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                // Deploy the application to Kubernetes
                sh '''
                kubectl set image deployment/node-app node-app=${ECR_URI}:latest --record
                kubectl rollout status deployment/node-app
                '''
            }
        }

    }
    post {
        always {
            echo 'Pipeline execution completed.'
        }
        success {
            echo 'Pipeline executed successfully.'
        }
        failure {
            echo 'Pipeline execution failed.'
        }
    }
}
