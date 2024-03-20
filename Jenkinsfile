pipeline {
    agent any
    environment {
        CI = 'false'
    }
    stages {
        stage('Install Dependencies & Build Frontend') {
            steps {
                dir('client') {
                    sh 'npm cache clean --force'
                    sh 'npm install'
                    sh 'npm install react-scripts react-router-dom'
                    sh 'npm run build'
                }
            }
        }
        stage('Deploy Backend and Frontend') {
            steps {
                withCredentials([string(credentialsId: 'fictional-employee-db-mongo-uri', variable: 'MONGO_URI')]) {
                sh 'docker-compose up -d'
                sh 'sleep 120'
                }
            }
        }
        stage('Populate Database') {
            steps {
                 sh 'docker exec jenkins-deploy-pipeline_server_1 node populate/populate.js'
                 sh 'sleep 10'
            }
        }
    }
    post {
        success {
            archiveArtifacts artifacts: 'client/build/*', allowEmptyArchive: true
        }
    }
}