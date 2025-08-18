FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# restore packages separately to make use of layer caching
COPY *.csproj ./backend-dotnet/
WORKDIR /app/backend-dotnet
RUN dotnet restore

WORKDIR /app
COPY . .
RUN dotnet publish -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 8080
ENTRYPOINT [ "dotnet", "PomodoroTimer.dll" ]