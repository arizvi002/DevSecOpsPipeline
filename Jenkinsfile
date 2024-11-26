pipeline {
    agent { label 'slave' }

    environment {
        ECR_URI = '060849198576.dkr.ecr.us-west-2.amazonaws.com/dev_sec_ops_app'
        AWS_REGION = 'us-west-2' // Replace with your AWS region
    }
    stages {
        stage('Checkout') {
            steps {
                // Pull code from GitHub
                checkout scm
            }
        }
        stage('Build') {
            steps {
                // Build Docker image
                sh 'docker build -t my-app:latest .'
            }
        }
        stage('Test') {
            steps {
                // Run application tests
                sh 'npm test'
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
