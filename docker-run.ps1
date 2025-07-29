# Auction Web Docker Runner Script for Windows PowerShell

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$White = "White"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

function Write-Header {
    Write-Host "================================" -ForegroundColor $Blue
    Write-Host "  Auction Web Docker Runner" -ForegroundColor $Blue
    Write-Host "================================" -ForegroundColor $Blue
}

# Function to check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check if docker-compose is available
function Test-DockerCompose {
    try {
        docker-compose --version | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to create uploads directory
function New-UploadsDirectory {
    if (-not (Test-Path "backend\uploads")) {
        Write-Status "Creating uploads directory..."
        New-Item -ItemType Directory -Path "backend\uploads" -Force | Out-Null
    }
}

# Function to show help
function Show-Help {
    Write-Host "Usage: .\docker-run.ps1 [COMMAND]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  start       Build and start all services"
    Write-Host "  stop        Stop all services"
    Write-Host "  restart     Restart all services"
    Write-Host "  logs        Show logs from all services"
    Write-Host "  logs-backend Show logs from backend only"
    Write-Host "  logs-frontend Show logs from frontend only"
    Write-Host "  rebuild     Rebuild all services"
    Write-Host "  clean       Stop and remove all containers, networks, and images"
    Write-Host "  status      Show status of all services"
    Write-Host "  help        Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\docker-run.ps1 start"
    Write-Host "  .\docker-run.ps1 logs"
    Write-Host "  .\docker-run.ps1 rebuild"
}

# Function to start services
function Start-Services {
    Write-Status "Starting Auction Web services..."
    New-UploadsDirectory
    docker-compose up -d --build
    Write-Status "Services started successfully!"
    Write-Status "Frontend: http://localhost:8080"
    Write-Status "Backend: http://localhost:8000"
    Write-Status "Backend Docs: http://localhost:8000/docs"
}

# Function to stop services
function Stop-Services {
    Write-Status "Stopping Auction Web services..."
    docker-compose down
    Write-Status "Services stopped successfully!"
}

# Function to restart services
function Restart-Services {
    Write-Status "Restarting Auction Web services..."
    docker-compose restart
    Write-Status "Services restarted successfully!"
}

# Function to show logs
function Show-Logs {
    param([string]$Service = "")
    
    if ($Service -eq "backend") {
        Write-Status "Showing backend logs..."
        docker-compose logs backend
    }
    elseif ($Service -eq "frontend") {
        Write-Status "Showing frontend logs..."
        docker-compose logs frontend
    }
    else {
        Write-Status "Showing all logs..."
        docker-compose logs
    }
}

# Function to rebuild services
function Rebuild-Services {
    Write-Status "Rebuilding Auction Web services..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    Write-Status "Services rebuilt and started successfully!"
}

# Function to clean everything
function Clean-All {
    Write-Warning "This will remove all containers, networks, and images. Are you sure? (y/N)"
    $response = Read-Host
    if ($response -match "^[yY](es)?$") {
        Write-Status "Cleaning up Docker resources..."
        docker-compose down --rmi all --volumes --remove-orphans
        docker system prune -f
        Write-Status "Cleanup completed!"
    }
    else {
        Write-Status "Cleanup cancelled."
    }
}

# Function to show status
function Show-Status {
    Write-Status "Service status:"
    docker-compose ps
    Write-Host ""
    Write-Status "Resource usage:"
    docker stats --no-stream
}

# Main script logic
function Main {
    Write-Header
    
    # Check prerequisites
    if (-not (Test-Docker)) {
        Write-Error "Docker is not running. Please start Docker Desktop first."
        exit 1
    }
    
    if (-not (Test-DockerCompose)) {
        Write-Error "docker-compose is not installed. Please install it first."
        exit 1
    }
    
    # Parse command
    switch ($Command) {
        "start" {
            Start-Services
        }
        "stop" {
            Stop-Services
        }
        "restart" {
            Restart-Services
        }
        "logs" {
            Show-Logs
        }
        "logs-backend" {
            Show-Logs "backend"
        }
        "logs-frontend" {
            Show-Logs "frontend"
        }
        "rebuild" {
            Rebuild-Services
        }
        "clean" {
            Clean-All
        }
        "status" {
            Show-Status
        }
        "help" {
            Show-Help
        }
        default {
            Write-Error "Unknown command: $Command"
            Write-Host ""
            Show-Help
            exit 1
        }
    }
}

# Run main function
Main 