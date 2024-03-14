pipeline {
    agent any
    
    stages {
        stage('Install Dependencies') {
            steps {
                dir('client') {
                    sh 'npm cache clean --force'
                    sh 'npm install'
                    sh 'npm install react-scripts react-router-dom'
                    sh 'export CI=false'
                    sh 'npm run build'
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