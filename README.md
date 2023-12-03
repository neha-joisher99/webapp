CloudCanvas: Cloud-Based Academic Turn-In

Overview
CloudCanvas is a cutting-edge project designed to transform academic assignment management and submission. Leveraging a potent combination of NodeJS, Sequelize ORM, AWS, Pulumi, Github Actions, and GCP, CloudCanvas delivers a secure, efficient, and scalable platform for educational institutions.

Key Features
Secure REST API: Built with NodeJS and Sequelize ORM, our REST API manages student assignments securely. Bycrpt for password encryption ensures enhanced data integrity and robust authentication.

Automated AWS Cloud Services: Pulumi enables Infrastructure-as-Code automation for AWS services, speeding up provisioning and setup. Custom EC2 machine images created with Packer enhance deployment efficiency.

Continuous Integration & Deployment: GitHub Actions automate integration tests for each pull request, ensuring code quality. Our Continuous Deployment process updates Amazon Machine Images (AMI) with load balancers, maintaining high availability and performance.

Real-time Monitoring: AWS CloudWatch integration provides real-time logging and metrics for quick incident response.

API Endpoints
CloudCanvas offers a streamlined and efficient API with three primary endpoints designed for simplicity and ease of use. These endpoints cater to different aspects of the application, ensuring a well-organized and intuitive interface for managing academic assignments and application health.

1. Assignments Endpoint
   Endpoint: /v3/assignments
   Description: This endpoint is the core of CloudCanvas, focused on student assignment management. It provides functionalities such as assignment submission, retrieval, and updates. Designed with REST principles, it ensures a smooth interaction for managing academic tasks.
   Usage: Ideal for students and educators to interact with assignment-related data.
2. Health Check Endpoint
   Endpoint: /healthz
   Description: Dedicated to monitoring the health of the CloudCanvas application. This endpoint is crucial for real-time status checks and is frequently used in automated health checks and monitoring systems.
   Usage: Useful for system administrators and DevOps teams to ensure the application is running smoothly and to quickly   identify any issues.
3. Application Root Endpoint
   Endpoint: /
   Description: Serves as the entry point to the CloudCanvas application. It provides general information about the application and can be used for initial navigation or as a landing page.
   Usage: Suitable for new users getting started with CloudCanvas and for general inquiries about the application.

Automatic Application Startup
Webapp Service: CloudCanvas includes webapp.service, which automates the application startup. This service configures CloudCanvas to start automatically, eliminating the need for manual intervention. This ensures that CloudCanvas is always up and running, providing uninterrupted service to its users.


Getting Started
To get started with CloudCanvas, follow these steps:

1. Clone the Repository: git clone git@github.com:neha-joisher99/webapp.git
2. Install Dependencies: Navigate to the project directory and run npm install to install the necessary NodeJS packages.
3. Configure AWS and Pulumi: Set up your AWS credentials and configure Pulumi for Infrastructure-as-Code deployment.

