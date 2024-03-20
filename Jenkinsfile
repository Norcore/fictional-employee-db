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
                stage('Test Website') {
            steps {
                script {
                    def responseCode = sh(script: 'curl -s -o /dev/null -w "%{http_code}" http://client:3000', returnStdout: true).trim()
                    if (responseCode == '200') {
                        echo 'Website is up!'
                    } else {
                        error 'Website is not responding correctly'
                    }
                }
            }
        }
        stage('Test Backend') {
            steps {
                script {
                    def backendResponseCode = sh(script: 'curl -s -o /dev/null -w "%{http_code}" http://server:3001', returnStdout: true).trim()
                    if (backendResponseCode == '200') {
                        echo 'Backend is up!'
                    } else {
                        error 'Backend is not responding correctly'
            }
        }
    }
}
    }
    post {
        success {
            archiveArtifacts artifacts: 'client/build/*', allowEmptyArchive: true
        }
    }
}