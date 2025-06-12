import { useState, useCallback } from 'react';
import { analyzePolicy, analyzePolicyFromUrl, analyzePolicyFromPdf } from '../services/api';
import { AnalysisResult } from '../types/analysis';

export const usePolicyAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const analyzeUrl = useCallback(async (url: string) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      const result = await analyzePolicyFromUrl(url);
      setAnalysisResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze URL');
      setError(error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const analyzeFile = useCallback(async (file: File) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      const result = await analyzePolicyFromPdf(file);
      setAnalysisResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze file');
      setError(error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    analysisResult,
    error,
    analyzeUrl,
    analyzeFile,
    reset
  };
};

export default usePolicyAnalysis;
