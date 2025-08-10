#!/bin/bash

# Docker rebuild script - Forces fresh builds without cache

# Available services
AVAILABLE_SERVICES=("frontend" "backend" "postgres" "pgadmin")

# Function to display usage
show_usage() {
    echo "Usage: $0 [SERVICE1] [SERVICE2] ... [OPTIONS]"
    echo ""
    echo "Services:"
    echo "  frontend  - React frontend with Nginx"
    echo "  backend   - NestJS API server"
    echo "  postgres  - PostgreSQL database"
    echo "  pgadmin   - PgAdmin database management"
    echo "  all       - Rebuild all services"
    echo ""
    echo "Options:"
    echo "  --logs        Show logs after starting"
    echo "  --help, -h    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Interactive menu"
    echo "  $0 frontend backend   # Rebuild only frontend and backend"
    echo "  $0 all --logs         # Rebuild all and show logs"
    echo ""
    echo "Note: This script always rebuilds without cache for fresh builds"
}

# Function to check if service is valid
is_valid_service() {
    local service=$1
    if [[ "$service" == "all" ]]; then
        return 0
    fi
    for valid_service in "${AVAILABLE_SERVICES[@]}"; do
        if [[ "$valid_service" == "$service" ]]; then
            return 0
        fi
    done
    return 1
}

# Function to show interactive menu
show_interactive_menu() {
    echo "Select service to rebuild (fresh build, no cache):"
    echo "1) frontend"
    echo "2) backend" 
    echo "3) postgres"
    echo "4) pgadmin"
    echo "5) all"
    echo ""
    
    read -p "Choice (1-5): " choice
    
    case $choice in
        1)
            SERVICES_TO_BUILD=("frontend")
            ;;
        2)
            SERVICES_TO_BUILD=("backend")
            ;;
        3)
            SERVICES_TO_BUILD=("postgres")
            ;;
        4)
            SERVICES_TO_BUILD=("pgadmin")
            ;;
        5)
            SERVICES_TO_BUILD=("all")
            ;;
        *)
            echo "Invalid option. Rebuilding all services."
            SERVICES_TO_BUILD=("all")
            ;;
    esac
}

# Parse command line arguments
SERVICES_TO_BUILD=()
SHOW_LOGS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            show_usage
            exit 0
            ;;
        --logs)
            SHOW_LOGS=true
            shift
            ;;
        -*)
            echo "Unknown option: $1"
            show_usage
            exit 1
            ;;
        *)
            if is_valid_service "$1"; then
                SERVICES_TO_BUILD+=("$1")
            else
                echo "Invalid service: $1"
                echo "Available services: ${AVAILABLE_SERVICES[*]} all"
                exit 1
            fi
            shift
            ;;
    esac
done

# Show interactive menu if no services specified
if [ ${#SERVICES_TO_BUILD[@]} -eq 0 ]; then
    show_interactive_menu
fi

# Convert "all" to actual services
if [[ " ${SERVICES_TO_BUILD[*]} " =~ " all " ]]; then
    SERVICES_TO_BUILD=("${AVAILABLE_SERVICES[@]}")
fi

echo "🔄 Rebuilding services (no cache): ${SERVICES_TO_BUILD[*]}"
echo ""

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove existing images for the services to rebuild
echo "🗑️  Removing existing images..."
for service in "${SERVICES_TO_BUILD[@]}"; do
    image_name="react-nestjs-postgres-usermanagement-crud-${service}"
    docker rmi "$image_name" 2>/dev/null || true
done

# Build services with no cache first
BUILD_CMD="docker-compose build --no-cache"

# Add specific services
for service in "${SERVICES_TO_BUILD[@]}"; do
    BUILD_CMD+=" $service"
done

echo "🔨 Building: $BUILD_CMD"
eval $BUILD_CMD

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Start the services
START_CMD="docker-compose up -d"

# Add specific services
for service in "${SERVICES_TO_BUILD[@]}"; do
    START_CMD+=" $service"
done

echo "🚀 Starting: $START_CMD"
eval $START_CMD

if [ $? -ne 0 ]; then
    echo "❌ Rebuild failed!"
    exit 1
fi

echo "✅ Services rebuilt successfully!"
echo ""
echo "🌐 Service URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8080"
echo "  PgAdmin: http://localhost:5050"
echo ""

# Show logs if requested
if [ "$SHOW_LOGS" = true ]; then
    echo "📄 Showing logs..."
    if [ ${#SERVICES_TO_BUILD[@]} -eq ${#AVAILABLE_SERVICES[@]} ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "${SERVICES_TO_BUILD[@]}"
    fi
fi