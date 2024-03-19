pipeline {
    agent any
    stages {
        stage('Install Dependencies') {
            steps {
                dir('client') {
                    sh 'npm cache clean --force'
                    sh 'npm install'
                    sh 'npm install react-scripts react-router-dom'
                    sh 'CI=false npm run build'
                }
            }
        }
        stage('Deploy Frontend') {
            steps {
                // Example: Deploy the frontend to a static site hosting service
                // This is a placeholder and should be replaced with actual deployment commands
                sh 'cp -r client/build/* /client/'
                sh 'npm start'
            }
        }
        stage('Deploy Backend') {
            steps {
                // Example: Deploy the backend using Docker Compose
                sh 'docker-compose up -d'
            }
        }
    }
    post {
        success {
            archiveArtifacts artifacts: 'client/build/*', allowEmptyArchive: true
        }
    }
}