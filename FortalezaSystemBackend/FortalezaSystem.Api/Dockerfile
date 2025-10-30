FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["FortalezaSystem.Application/FortalezaSystem.Application.csproj", "FortalezaSystem.Application/"]
COPY ["FortalezaSystem.Domain/FortalezaSystem.Domain.csproj", "FortalezaSystem.Domain/"]
COPY ["FortalezaSystem.Infrastructure/FortalezaSystem.Infrastructure.csproj", "FortalezaSystem.Infrastructure/"]
COPY ["FortalezaSystem.Common/FortalezaSystem.Common.csproj", "FortalezaSystem.Common/"]
COPY ["FortalezaSystem.Api/FortalezaSystem.Api.csproj", "FortalezaSystem.Api/"]

RUN dotnet restore "FortalezaSystem.Api/FortalezaSystem.Api.csproj"

COPY . .
WORKDIR "/src/FortalezaSystem.Api"
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "FortalezaSystem.Api.dll"]
