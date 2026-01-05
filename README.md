# 🔗 Chain Middleware

A robust Node.js/Express API acting as the secure bridge between Client Applications (Web/Mobile) and the **Service Blockchain Network**. This middleware abstracts the complexity of Hyperledger Fabric's gRPC protocols, exposing simple REST endpoints for asset management.

![Status](https://img.shields.io/badge/Status-Active-success)
![Tech](https://img.shields.io/badge/Tech-Node.js%20%7C%20Express%20%7C%20Fabric%20SDK-blue)

---

## 📖 Table of Contents
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Folder Structure](#-folder-structure)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [How it Works (Fabric Gateway)](#-how-it-works)

---

## 🏛 Architecture

This middleware implements the **Fabric Gateway Pattern**:

1.  **Client:** Sends JSON HTTP requests (e.g., `POST /create`).
2.  **Middleware:**
    * Validates the request.
    * Loads the **Wallet Identity** (X.509 Certificate).
    * Connects to the **Fabric Gateway** via gRPC.
3.  **Blockchain:** Submits the transaction to the Peer nodes for endorsement and committing.

```text
[Mobile App] <--> [HTTP/JSON] <--> [Middleware (This Repo)] <--> [gRPC] <--> [Fabric Network]
