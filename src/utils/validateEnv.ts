/**
 * Environment Variable Validation Utility
 * Provides helpful error messages when required vars are missing
 */

export interface EnvValidationOptions {
  isDevelopment?: boolean;
  optional?: string[];
  required?: string[];
}

export function validateEnvironment(options: EnvValidationOptions = {}) {
  const {
    isDevelopment = process.env.NODE_ENV !== 'production',
    optional = [],
    required = [],
  } = options;

  // Define default required variables
  const defaultRequired = [
    'DATABASE_URL',
    'REDIS_HOST',
    'REDIS_PORT',
  ];

  // Add GitHub vars if production
  const githubRequired = isDevelopment ? [] : [
    'GITHUB_APP_ID',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
  ];

  const allRequired = [...defaultRequired, ...githubRequired, ...required];
  const missingVars = allRequired.filter(varName => !process.env[varName]);

  if (missingVars.length === 0) {
    return { valid: true, errors: [] };
  }

  const errors: string[] = [];
  
  errors.push(`Missing ${missingVars.length} required environment variable(s):`);
  missingVars.forEach(v => errors.push(`  - ${v}`));

  if (isDevelopment) {
    errors.push('');
    errors.push('For local development:');
    errors.push('  1. Copy .env.example to .env.development.local');
    errors.push('  2. Fill in at least: DATABASE_URL, REDIS_HOST, REDIS_PORT');
    errors.push('  3. GitHub vars are optional in development');
    errors.push('');
    errors.push('Quick setup with Docker:');
    errors.push('  npm run docker:up');
    errors.push('  npm run dev');
  } else {
    errors.push('');
    errors.push('For production:');
    errors.push('  Set all required environment variables in your deployment platform');
  }

  return { valid: false, errors };
}

export function logEnvValidation(options?: EnvValidationOptions) {
  const result = validateEnvironment(options);
  
  if (!result.valid) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ Environment Validation Failed');
    console.error('='.repeat(60) + '\n');
    result.errors.forEach(error => console.error(error));
    console.error('\n' + '='.repeat(60) + '\n');
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated\n');
}
