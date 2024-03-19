pipeline {
    agent any
    stages {
        stage('Build and Run Container') {
            steps {
                script {
                    sh 'docker-compose up'
                }
            }
        }
    }
}