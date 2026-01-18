import logging
import json
import os
from google import genai

logger = logging.getLogger(__name__)


class AIAnalyzer:
    """AI-powered analysis using Google Gemini API"""

    def __init__(self, api_key=None):
        """Initialize Gemini client"""
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not set. AI analysis will not work.")
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    def generate_report(self, analysis_result):
        """Generate AI summary/report from URL analysis result"""
        try:
            if not self.client:
                return {
                    'status': 'error',
                    'error': 'Gemini API key not configured',
                    'ai_summary': None
                }

            # Prepare analysis data for AI
            analysis_summary = self._prepare_analysis_summary(analysis_result)

            # Create prompt for Gemini
            prompt = self._create_prompt(analysis_summary, analysis_result)

            logger.info("Generating AI report using Gemini...")

            # Generate content using Gemini
            response = self.client.models.generate_content(
                model="gemini-3.0-flash",
                contents=prompt,
            )

            report = {
                'status': 'success',
                'ai_summary': response.text,
                'analysis_data': {
                    'original_url': analysis_result.get('original_url'),
                    'final_destination': analysis_result.get('final_destination'),
                    'total_hops': analysis_result.get('total_hops'),
                    'risk_level': analysis_result.get('risk_assessment', {}).get('level'),
                    'safety_score': analysis_result.get('risk_assessment', {}).get('score'),
                    'is_safe': analysis_result.get('is_safe')
                }
            }

            return report

        except Exception as e:
            logger.error(f"Error generating AI report: {str(e)}")
            return {
                'status': 'error',
                'error': str(e),
                'ai_summary': None
            }

    def _prepare_analysis_summary(self, analysis_result):
        """Prepare a concise summary of the analysis"""
        redirect_chain = analysis_result.get('redirect_chain', [])
        risk_assessment = analysis_result.get('risk_assessment', {})

        summary = {
            'original_url': analysis_result.get('original_url'),
            'final_url': analysis_result.get('final_destination', {}).get('url'),
            'hops_count': analysis_result.get('total_hops'),
            'risk_level': risk_assessment.get('level'),
            'risk_score': risk_assessment.get('score'),
            'risk_reasons': risk_assessment.get('reasons', []),
            'is_safe': analysis_result.get('is_safe'),
            'redirect_details': [
                {
                    'hop': h.get('hop'),
                    'from': h.get('domain'),
                    'status': h.get('status_code'),
                    'types': h.get('types', [])
                }
                for h in redirect_chain[:10]  # Limit to first 10 hops
            ]
        }

        return summary

    def _create_prompt(self, analysis_summary, full_analysis):
        """Create prompt for Gemini AI"""
        prompt = f"""
You are a cybersecurity expert analyzing URL redirect chains and web safety. Analyze the following URL security analysis and provide a comprehensive report.

ANALYSIS RESULTS:
- Original URL: {analysis_summary['original_url']}
- Final Destination: {analysis_summary['final_url']}
- Total Redirects/Hops: {analysis_summary['hops_count']}
- Risk Level: {analysis_summary['risk_level'].upper()}
- Safety Score: {analysis_summary['risk_score']}/100
- Is Safe: {analysis_summary['is_safe']}
- Risk Reasons: {', '.join(analysis_summary['risk_reasons'])}

REDIRECT CHAIN DETAILS:
"""
        for redirect in analysis_summary['redirect_details']:
            prompt += f"\n  - Hop {redirect['hop']}: {redirect['from']} (Status: {redirect['status']}) - Types: {', '.join(redirect['types'])}"

        prompt += """

Based on this analysis, provide:
1. **Summary**: A brief overview of the URL analysis
2. **Risk Assessment**: What specific threats or concerns were identified
3. **Key Findings**: The most important observations about this URL
4. **Recommendations**: What actions the user should take
5. **Final Verdict**: Is this URL safe to visit? Why or why not?

Format your response in clear sections with markdown formatting. Be concise but thorough.
"""
        return prompt
