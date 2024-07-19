# Use the official .NET SDK image from Microsoft's container registry
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY server/*.csproj ./server/
RUN dotnet restore server/*.csproj

# Copy everything else and build
COPY server/. ./server/
WORKDIR /app/server
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/server/out ./
ENTRYPOINT ["dotnet", "server.dll"]
