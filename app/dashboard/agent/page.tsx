'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { STTProvider, STTModel, STTLanguage, STTConfiguration } from '@/lib/types';

export default function AgentPage() {
  const [providers, setProviders] = useState<STTProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<STTProvider | null>(null);
  const [selectedModel, setSelectedModel] = useState<STTModel | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<STTLanguage | null>(null);
  const [dropdownStates, setDropdownStates] = useState({
    provider: false,
    model: false,
    language: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    loadSTTConfiguration();
    loadSavedSelections();
  }, []);

  const loadSTTConfiguration = async () => {
    try {
      const response = await fetch('/stt.json');
      const data = await response.json();
      setProviders(data.providers);
    } catch (error) {
      console.error('Failed to load STT configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedSelections = () => {
    const saved = localStorage.getItem('sttConfiguration');
    if (saved) {
      const config: STTConfiguration = JSON.parse(saved);
      
      // Find and set saved selections
      const provider = providers.find(p => p.id === config.provider);
      if (provider) {
        setSelectedProvider(provider);
        
        const model = provider.models.find(m => m.id === config.model);
        if (model) {
          setSelectedModel(model);
          
          const language = model.languages.find(l => l.id === config.language);
          if (language) {
            setSelectedLanguage(language);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (providers.length > 0) {
      loadSavedSelections();
    }
  }, [providers]);

  const toggleDropdown = (dropdown: keyof typeof dropdownStates) => {
    setDropdownStates(prev => ({
      provider: false,
      model: false,
      language: false,
      [dropdown]: !prev[dropdown],
    }));
  };

  const selectProvider = (provider: STTProvider) => {
    setSelectedProvider(provider);
    setSelectedModel(null);
    setSelectedLanguage(null);
    setDropdownStates(prev => ({ ...prev, provider: false }));
    saveConfiguration(provider.id, '', '');
  };

  const selectModel = (model: STTModel) => {
    setSelectedModel(model);
    setSelectedLanguage(null);
    setDropdownStates(prev => ({ ...prev, model: false }));
    if (selectedProvider) {
      saveConfiguration(selectedProvider.id, model.id, '');
    }
  };

  const selectLanguage = (language: STTLanguage) => {
    setSelectedLanguage(language);
    setDropdownStates(prev => ({ ...prev, language: false }));
    if (selectedProvider && selectedModel) {
      saveConfiguration(selectedProvider.id, selectedModel.id, language.id);
    }
  };

  const saveConfiguration = (providerId: string, modelId: string, languageId: string) => {
    const config: STTConfiguration = {
      provider: providerId,
      model: modelId,
      language: languageId,
    };
    localStorage.setItem('sttConfiguration', JSON.stringify(config));
    
    if (providerId && modelId && languageId) {
      setSavedMessage('Configuration saved successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Agent Configuration</h1>
        <p className="text-muted-foreground mt-2">
          Configure your speech-to-text settings and preferences
        </p>
      </div>

      {savedMessage && (
        <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 flex items-center">
          <Check className="h-4 w-4 mr-2" />
          {savedMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              STT Configuration
            </CardTitle>
            <CardDescription>
              Select your speech-to-text provider, model, and language preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Provider Dropdown */}
            <div className="space-y-2">
              <Label>Provider</Label>
              <div className="relative">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => toggleDropdown('provider')}
                >
                  {selectedProvider ? selectedProvider.name : 'Select Provider'}
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    dropdownStates.provider && "rotate-180"
                  )} />
                </Button>
                {dropdownStates.provider && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg animate-slide-in">
                    {providers.map((provider) => (
                      <button
                        key={provider.id}
                        className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-md last:rounded-b-md"
                        onClick={() => selectProvider(provider)}
                      >
                        {provider.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Model Dropdown */}
            <div className="space-y-2">
              <Label>Model</Label>
              <div className="relative">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => toggleDropdown('model')}
                  disabled={!selectedProvider}
                >
                  {selectedModel ? selectedModel.name : 'Select Model'}
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    dropdownStates.model && "rotate-180"
                  )} />
                </Button>
                {dropdownStates.model && selectedProvider && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg animate-slide-in">
                    {selectedProvider.models.map((model) => (
                      <button
                        key={model.id}
                        className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-md last:rounded-b-md"
                        onClick={() => selectModel(model)}
                      >
                        {model.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Language Dropdown */}
            <div className="space-y-2">
              <Label>Language</Label>
              <div className="relative">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => toggleDropdown('language')}
                  disabled={!selectedModel}
                >
                  {selectedLanguage ? selectedLanguage.name : 'Select Language'}
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    dropdownStates.language && "rotate-180"
                  )} />
                </Button>
                {dropdownStates.language && selectedModel && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg animate-slide-in">
                    {selectedModel.languages.map((language) => (
                      <button
                        key={language.id}
                        className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-md last:rounded-b-md"
                        onClick={() => selectLanguage(language)}
                      >
                        {language.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration Summary</CardTitle>
            <CardDescription>
              Current selection overview and configuration details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProvider && selectedModel && selectedLanguage ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">PROVIDER</Label>
                    <p className="text-sm font-medium">{selectedProvider.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedProvider.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">MODEL</Label>
                    <p className="text-sm font-medium">{selectedModel.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedModel.id}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">LANGUAGE</Label>
                  <p className="text-sm font-medium">{selectedLanguage.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedLanguage.code}</p>
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Configuration Complete
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your STT configuration is saved and ready to use.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  {!selectedProvider && 'Select a provider to continue'}
                  {selectedProvider && !selectedModel && 'Select a model to continue'}
                  {selectedProvider && selectedModel && !selectedLanguage && 'Select a language to complete setup'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}