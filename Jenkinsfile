pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                script {
                    // Use Node.js from NodeJS plugin if configured
                    // Or use system Node.js
                    sh 'node --version'
                    sh 'npm --version'
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Start Server & Test Endpoint') {
            steps {
                script {
                    // Start server in background
                    sh 'nohup node server.js > server.log 2>&1 & echo $! > server.pid'
                    
                    // Wait for server to start
                    sh 'sleep 5'
                    
                    // Test endpoint with curl
                    sh 'curl -f http://localhost:2020/ || exit 1'
                    
                    // Kill the server
                    sh 'kill $(cat server.pid) || true'
                }
            }
        }
    }
    
    post {
        always {
            // Cleanup: ensure server is stopped
            sh 'kill $(cat server.pid) 2>/dev/null || true'
            sh 'rm -f server.pid server.log'
        }
    }
}
