pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                sh 'docker build -t my-app:latest .'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Push to ECR') {
            steps {
                withCredentials([string(credentialsId: 'aws-credentials', variable: 'AWS_ACCESS_KEY')]) {
                    sh '''
                    aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-west-2.amazonaws.com
                    docker tag my-app:latest <AWS_ACCOUNT_ID>.dkr.ecr.us-west-2.amazonaws.com/my-app:latest
                    docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-west-2.amazonaws.com/my-app:latest
                    '''
                }
            }
        }
    }
}
