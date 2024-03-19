pipeline {
    agent any
    environment {
        MONGO_URI = credentials('30bc6247-df28-4684-9743-65a33e92eedc')
    }
    stages {
        stage('Install Dependencies & Build Frontend') {
            steps {
                dir('client') {
                    sh 'npm cache clean --force'
                    sh 'npm install'
                    sh 'npm install react-scripts react-router-dom'
                    sh 'CI=false npm run build'
                }
            }
        }
        stage('Deploy Backend') {
            steps {
                withCredentials([string(credentialsId: 'fictional-employee-db-mongo-uri', variable: 'MONGO_URI')]) {
                sh 'docker-compose up -d'
                }
            }
        }
        stage('Serve Frontend') {
            steps {
                dir('client') {
                sh 'npm install serve'
                sh 'npx serve -s build -l 3000 &'
                sh 'sleep 15'
                }
            }
        }
        stage('Test Website') {
            steps {
                script {
                    def responseCode = sh(script: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', returnStdout: true).trim()
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
                    def backendResponseCode = sh(script: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3001', returnStdout: true).trim()
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