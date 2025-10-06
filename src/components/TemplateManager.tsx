import React, { useState } from 'react';
import { Save, Trash2, Clock, Users, Settings, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useTemplates } from '../hooks/useTemplates';
import type { TemplateConfig, TeamTemplate } from '../utils/teamGenerator';

interface TemplateManagerProps {
  currentConfig: TemplateConfig;
  onLoadTemplate: (config: TemplateConfig) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ currentConfig, onLoadTemplate }) => {
  const { templates, saveTemplate, deleteTemplate, updateLastUsed, getRecentTemplates } = useTemplates();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const recentTemplates = getRecentTemplates(3);

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      saveTemplate(templateName, currentConfig, templateDescription);
      setTemplateName('');
      setTemplateDescription('');
      setShowSaveForm(false);
    }
  };

  const handleLoadTemplate = (template: TeamTemplate) => {
    const config: TemplateConfig = {
      teamCount: template.teamCount,
      requirements: template.requirements,
      skillConfig: template.skillConfig,
    };
    onLoadTemplate(config);
    updateLastUsed(template.id);
  };

  const formatTemplateInfo = (template: TeamTemplate) => {
    const parts = [];
    parts.push(`${template.teamCount} times`);
    
    if (template.requirements) {
      parts.push(`${template.requirements.menPerTeam}H/${template.requirements.womenPerTeam}M por time`);
    }
    
    if (template.skillConfig.enabled) {
      parts.push('Balanceamento por habilidade');
    }
    
    return parts.join(' • ');
  };

  const getSkillStrategyLabel = (strategy: string) => {
    const labels = {
      'balanced': 'Balanceado',
      'mixed': 'Misto',
      'random': 'Aleatório'
    };
    return labels[strategy as keyof typeof labels] || strategy;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Save className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Templates de Times</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {/* Templates Recentes */}
      {recentTemplates.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Usados Recentemente</span>
          </div>
          <div className="grid gap-2">
            {recentTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleLoadTemplate(template)}
                className="text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
              >
                <div className="font-medium text-blue-800">{template.name}</div>
                <div className="text-xs text-blue-600 mt-1">{formatTemplateInfo(template)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Botão Salvar Configuração Atual */}
      <div className="mb-4">
        <button
          onClick={() => setShowSaveForm(!showSaveForm)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          Salvar Configuração Atual
        </button>
      </div>

      {/* Formulário de Salvar */}
      {showSaveForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Template *
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Ex: Torneio Misto 6v6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição (opcional)
              </label>
              <input
                type="text"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Descrição do template..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => setShowSaveForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista Completa de Templates */}
      {isExpanded && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Settings className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Todos os Templates</span>
          </div>
          
          {templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Save className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum template salvo ainda</p>
              <p className="text-sm">Salve sua primeira configuração acima</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800 truncate">{template.name}</span>
                      {template.skillConfig.enabled && (
                        <Star className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                    {template.description && (
                      <div className="text-xs text-gray-600 mb-1 truncate">{template.description}</div>
                    )}
                    <div className="text-xs text-gray-500">{formatTemplateInfo(template)}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={() => handleLoadTemplate(template)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Carregar
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      title="Excluir template"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateManager;