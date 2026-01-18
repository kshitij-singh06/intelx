from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from datetime import datetime
import time
from services.redirect_chain_analyzer import RedirectChainAnalyzer
from services.ai_analyzer import AIAnalyzer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize services
redirect_analyzer = RedirectChainAnalyzer()
ai_analyzer = AIAnalyzer()


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()}), 200


@app.route('/api/url-analyzer/analyze', methods=['POST'])
def analyze_url():
    """Analyze URL redirect chain and path to destination"""
    try:
        start_time = time.time()
        data = request.get_json()
        url = data.get('url')

        if not url:
            return jsonify({'error': 'URL is required'}), 400

        logger.info(f"Analyzing URL: {url}")

        # Analyze redirect chain
        result = redirect_analyzer.analyze(url)
        
        # Add timing
        analysis_time_ms = int((time.time() - start_time) * 1000)
        result['analysis_time_ms'] = analysis_time_ms

        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error analyzing URL: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/url-analyzer/ai-analyze', methods=['POST'])
def ai_analyze_url():
    """Generate AI-powered summary/report of URL analysis"""
    try:
        start_time = time.time()
        data = request.get_json()
        url = data.get('url')

        if not url:
            return jsonify({'error': 'URL is required'}), 400

        logger.info(f"Generating AI analysis for URL: {url}")

        # First, get the URL analysis
        analysis_result = redirect_analyzer.analyze(url)
        
        # Then generate AI report
        ai_report = ai_analyzer.generate_report(analysis_result)
        
        # Combine results
        result = {
            'url': url,
            'timestamp': datetime.now().isoformat(),
            'analysis': analysis_result,
            'ai_report': ai_report,
            'analysis_time_ms': int((time.time() - start_time) * 1000)
        }

        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error in AI analysis: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
