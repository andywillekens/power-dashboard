# Power dashboard

A simple dashboard to show my power generation and consumption.
You can preview this project here: [https://power.andywillekens.nl](https://power.andywillekens.nl)

## Requirements

Ensure you have the following installed and ready to use:

- **Eneco API Credentials** - You need an access token for the Eneco/Toon API. See [https://developer.toon.eu/api-intro](developer.toon.eu) for more inforation.
- **APSystems user ID** - You need an Authorization ID and check the `Allow visitors to access to this system` checkbox. Log in to [https://apsystemsema.com/ema/index.action](https://apsystemsema.com) and go to settings.
- **Prettier** - Code formatter (recommended VS Code plugin)
- **Tailwind CSS IntelliSense** - VS Code plugin for Tailwind class suggestions and completions

## Getting Started

To start the development server locally with Docker:

```bash
docker compose up -d
```

This command builds and launches the Nuxt development environment within Docker. Once started, you can access the project in your browser at [http://localhost:3000](http://localhost:3000).

## Stopping the Development Environment

To stop and remove the running containers:

```bash
docker compose down
```

## Troubleshooting

If you encounter any issues, try rebuilding the containers:

```bash
docker compose up --build
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to enhance the setup.
