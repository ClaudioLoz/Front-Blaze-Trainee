let config =
{
    'NODE_ENV': process.env.NODE_ENV,
    'dev': process.env.NODE_ENV === 'development',
    'prod': process.env.NODE_ENV === 'production',
    'test': process.env.NODE_ENV === 'test',
    'debug': process.env.DEBUG || false,
    'baseName': process.env.BASENAME || '',
    'api': process.env.API_URL || 'http://localhost:8080/',
    'report_api': process.env.REPORT_API || 'https://api.dev.blaze.me/',
    'gaID': process.env.GA_ID || 'UA-82642500-5',
    'stripePK': process.env.stripePK || 'pk_test_AEL7yfcOpRn4OfAISb5Mg0oj',
    'retailUrl': process.env.RETAIL_URL,
}

export default config