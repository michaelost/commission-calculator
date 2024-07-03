# Commission Calculator

## How to Run

### Environment Variables

This project requires certain environment variables to be set. Create a `.env` file in the root directory of the project with the following content:

```env
BASE_API_URL=https://developers.example.com
```

1. Install dependencies:
   ```bash
   npm install
   ```

2. Compile the TypeScript code:
   ```bash
   npm run build
   ```

3. Place your input data file in the `data` directory and name it `input.json`.

4. Run the application:
   ```bash
   npm start
   ```

## How to Run Tests

1. Run the tests:
   ```bash
   npm test
   ```

### ESLint

The project uses ESLint with the Airbnb JavaScript Style Guide. To lint the code, run:

```bash
npm run lint
```

## Description

This application calculates commission fees for cash in and cash out operations based on provided configurations. It supports both natural and legal persons, with specific rules for each type.

### Implementation Details

- **Extensibility**: The system uses a strategy pattern to handle different types of commission calculations. New calculation strategies can be added without modifying the core logic:
- To add a new calculation rule:
Create a new class in the `src/services/commissionStrategies` directory that extends the BaseStrategy class. Implement the calculate method in the new class Update the StrategyManager class to include the new strategy.

- **Rounding**: Commission fees are rounded up to the nearest cent.
- **Configuration**: The application fetches commission fee configurations from external APIs.
- **Error Handling**: The application handles unsupported operation types and user types by logging errors and outputting `null` for the corresponding results. Errors are logged in the `logs/errors.log` file.
- **Logging**: Errors encountered during processing are logged with details of the transaction and the error message.
