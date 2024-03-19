pipeline {
    agent any
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
                sh 'docker-compose up -d'
            }
        }
        stage('Serve Frontend') {
            steps {
                dir('client') {
                sh 'npm install serve'
                sh 'npx serve -s build'
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