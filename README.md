# AWS DocumentDB Export Tool 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green)](https://www.mongodb.com/)

A modern, web-based tool for seamlessly exporting AWS DocumentDB collections to CSV format. Built with Next.js 15 and designed for development teams who need a user-friendly interface for data export operations.

## ✨ Features

- 🔄 **Multiple Database Environment Management**
  - Save and manage multiple DocumentDB connection profiles
  - Easy switching between different environments
  - Connection testing and validation

- 📊 **CSV Export Capabilities**
  - Export entire collections or filtered data
  - Custom field selection for exports
  - Handles complex MongoDB data types
  - Progress tracking for large exports

- 🎨 **Modern UI/UX**
  - Built with Next.js 15 and shadcn/ui
  - Responsive design
  - Dark/Light mode support
  - Real-time operation feedback

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- MongoDB 5.0+ or AWS DocumentDB (with MongoDB compatibility)
- AWS Account (optional, required for DocumentDB access)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/msgadi/aws-doc-db-export.git
   cd aws-doc-db-export
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```
   MONGODB_URI=your_mongodb_uri
   AWS_REGION=your_aws_region (optional)
   AWS_ACCESS_KEY_ID=your_access_key (optional)
   AWS_SECRET_ACCESS_KEY=your_secret_key (optional)
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## 🔧 Configuration

### AWS DocumentDB Setup

If you're using AWS DocumentDB:

1. Ensure your DocumentDB cluster is accessible from your deployment environment
2. Configure security groups and VPC settings if necessary
3. Use AWS credentials with appropriate permissions:
   - `rds:DescribeDBClusters`
   - `rds:DescribeDBInstances`
   - Additional permissions based on your setup

### MongoDB Compatibility

- Requires MongoDB 5.0 or later
- Supports both standalone MongoDB and AWS DocumentDB
- Handles MongoDB-specific data types during CSV conversion

## 🤝 Contributing

We love your input! We want to make contributing as easy and transparent as possible. Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Submitting bug reports
- Proposing new features
- Submitting pull requests

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🗺️ Roadmap

- [ ] Support for additional export formats (JSON, XLSX)
- [ ] Advanced filtering options
- [ ] Scheduled exports
- [ ] Export templates
- [ ] Import functionality
- [ ] Real-time data preview

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [MongoDB](https://www.mongodb.com/) - Database
- [AWS DocumentDB](https://aws.amazon.com/documentdb/) - Document Database Service

## 📸 Screenshots

Coming soon!

## 🏗️ Architecture

Architecture diagram coming soon!

---

Built with ❤️ by Mohammed Gadi

[⬆ back to top](#aws-documentdb-csv-export-tool-)
