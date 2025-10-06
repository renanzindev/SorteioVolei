import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { TeamTemplate, TemplateConfig } from '../utils/teamGenerator';

interface UseTemplatesReturn {
  templates: TeamTemplate[];
  saveTemplate: (name: string, config: TemplateConfig, description?: string) => void;
  loadTemplate: (templateId: string) => TeamTemplate | null;
  deleteTemplate: (templateId: string) => void;
  updateLastUsed: (templateId: string) => void;
  getRecentTemplates: (limit?: number) => TeamTemplate[];
}

export const useTemplates = (): UseTemplatesReturn => {
  const [templates, setTemplates] = useLocalStorage<TeamTemplate[]>('team-templates', [], {
    validator: (value) => Array.isArray(value) && value.every(template => 
      typeof template === 'object' &&
      typeof template.id === 'string' &&
      typeof template.name === 'string' &&
      typeof template.teamCount === 'number' &&
      typeof template.createdAt === 'string'
    )
  });

  const saveTemplate = useCallback((name: string, config: TemplateConfig, description?: string) => {
    const newTemplate: TeamTemplate = {
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description?.trim(),
      teamCount: config.teamCount,
      requirements: config.requirements,
      skillConfig: config.skillConfig,
      createdAt: new Date(),
    };

    setTemplates(prev => {
      // Verificar se já existe um template com o mesmo nome
      const existingIndex = prev.findIndex(t => t.name.toLowerCase() === name.toLowerCase().trim());
      
      if (existingIndex >= 0) {
        // Atualizar template existente
        const updated = [...prev];
        updated[existingIndex] = { ...newTemplate, id: prev[existingIndex].id, createdAt: prev[existingIndex].createdAt };
        return updated;
      } else {
        // Adicionar novo template
        return [...prev, newTemplate];
      }
    });
  }, [setTemplates]);

  const loadTemplate = useCallback((templateId: string): TeamTemplate | null => {
    const template = templates.find(t => t.id === templateId);
    return template || null;
  }, [templates]);

  const deleteTemplate = useCallback((templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  }, [setTemplates]);

  const updateLastUsed = useCallback((templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, lastUsed: new Date() }
        : template
    ));
  }, [setTemplates]);

  const getRecentTemplates = useCallback((limit: number = 5): TeamTemplate[] => {
    return [...templates]
      .filter(t => t.lastUsed)
      .sort((a, b) => {
        const dateA = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
        const dateB = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit);
  }, [templates]);

  return {
    templates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    updateLastUsed,
    getRecentTemplates,
  };
};