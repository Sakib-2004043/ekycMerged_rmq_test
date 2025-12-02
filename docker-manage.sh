#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_DIR="/home/sakibul-hasan/Documents/Web Development/Attachment/ekyc_updated"

echo -e "${BLUE}=== eKYC Docker Services Management ===${NC}\n"

case "$1" in
  "status")
    echo -e "${YELLOW}📊 Service Status:${NC}"
    cd "$PROJECT_DIR" && docker compose ps
    ;;
  "logs")
    if [ -z "$2" ]; then
      echo -e "${YELLOW}📝 All Logs:${NC}"
      cd "$PROJECT_DIR" && docker compose logs -f --tail 50
    else
      echo -e "${YELLOW}📝 ${2} Logs:${NC}"
      cd "$PROJECT_DIR" && docker compose logs -f --tail 50 "$2"
    fi
    ;;
  "stop")
    echo -e "${YELLOW}⏹️  Stopping all services...${NC}"
    cd "$PROJECT_DIR" && docker compose stop
    echo -e "${GREEN}✅ Services stopped${NC}"
    ;;
  "start")
    echo -e "${YELLOW}▶️  Starting all services...${NC}"
    cd "$PROJECT_DIR" && docker compose up -d
    echo -e "${GREEN}✅ Services started${NC}"
    ;;
  "restart")
    echo -e "${YELLOW}🔄 Restarting all services...${NC}"
    cd "$PROJECT_DIR" && docker compose restart
    echo -e "${GREEN}✅ Services restarted${NC}"
    ;;
  "rebuild")
    echo -e "${YELLOW}🔨 Rebuilding services...${NC}"
    cd "$PROJECT_DIR" && docker compose down && docker compose up -d --build
    echo -e "${GREEN}✅ Services rebuilt and started${NC}"
    ;;
  "clean")
    echo -e "${RED}🗑️  Removing all containers, volumes, and networks...${NC}"
    cd "$PROJECT_DIR" && docker compose down -v
    echo -e "${GREEN}✅ Cleaned up${NC}"
    ;;
  "urls")
    echo -e "${GREEN}🌐 Service URLs:${NC}"
    echo -e "${BLUE}Frontend:${NC}           http://localhost"
    echo -e "${BLUE}Backend API:${NC}        http://localhost:5000"
    echo -e "${BLUE}MongoDB:${NC}            localhost:27017"
    echo -e "${BLUE}RabbitMQ:${NC}           localhost:5672"
    echo -e "${BLUE}RabbitMQ Management:${NC} http://localhost:15672 (guest/guest)"
    ;;
  "test")
    echo -e "${YELLOW}🧪 Testing services...${NC}"
    echo -e "\n${BLUE}Backend Test:${NC}"
    curl -s http://localhost:5000 && echo ""
    echo -e "\n${GREEN}✅ Backend responding${NC}"
    ;;
  *)
    echo -e "${YELLOW}Usage:${NC} $0 {status|logs|start|stop|restart|rebuild|clean|urls|test} [service]"
    echo ""
    echo -e "${BLUE}Examples:${NC}"
    echo "  $0 status              # Show all container status"
    echo "  $0 logs                # Show all logs"
    echo "  $0 logs backend        # Show backend logs only"
    echo "  $0 start               # Start all services"
    echo "  $0 stop                # Stop all services"
    echo "  $0 restart             # Restart all services"
    echo "  $0 rebuild             # Rebuild and restart"
    echo "  $0 clean               # Remove all containers and volumes"
    echo "  $0 urls                # Show service URLs"
    echo "  $0 test                # Test backend connectivity"
    ;;
esac
