/**
 * Content Filter Utility
 * Filters offensive, inappropriate, and pornographic content
 */

// Comprehensive list of inappropriate words (this is a basic set - you can expand it)
const INAPPROPRIATE_WORDS = [
    // Explicit sexual content
    'porn', 'pornography', 'xxx', 'sex', 'sexual', 'nude', 'naked', 'strip',
    'escort', 'prostitute', 'brothel', 'adult entertainment', 'erotic',

    // Offensive language
    'fuck', 'shit', 'damn', 'hell', 'bitch', 'bastard', 'asshole', 'crap',

    // Hate speech and discrimination
    'racist', 'nazi', 'terrorist', 'kill', 'murder', 'violence', 'hate',

    // Gambling and illegal activities
    'gambling', 'casino', 'drugs', 'cocaine', 'marijuana', 'illegal',
    'scam', 'fraud', 'money laundering',

    // Inappropriate services
    'dating service', 'hookup', 'one night stand', 'sugar daddy', 'sugar baby',

    // Add more words as needed
];

// Words that might be legitimate in tech context but need careful checking
const CONTEXT_SENSITIVE_WORDS = [
    'adult', 'mature', 'private', 'personal', 'intimate'
];

class ContentFilter {
    constructor() {
        // Convert to lowercase for case-insensitive matching
        this.inappropriateWords = INAPPROPRIATE_WORDS.map(word => word.toLowerCase());
        this.contextSensitive = CONTEXT_SENSITIVE_WORDS.map(word => word.toLowerCase());
    }

    /**
     * Check if text contains inappropriate content
     * @param {string} text - Text to validate
     * @param {boolean} strict - Whether to use strict mode (includes context-sensitive words)
     * @returns {object} - Validation result
     */
    validateContent(text, strict = false) {
        if (!text || typeof text !== 'string') {
            return { isValid: true, flaggedWords: [], reason: null };
        }

        const normalizedText = text.toLowerCase();
        const flaggedWords = [];
        let reason = null;

        // Check for inappropriate words
        for (const word of this.inappropriateWords) {
            // Use word boundaries to avoid false positives
            const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            if (regex.test(normalizedText)) {
                flaggedWords.push(word);
                reason = 'inappropriate_content';
            }
        }

        // Check context-sensitive words in strict mode
        if (strict) {
            for (const word of this.contextSensitive) {
                const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                if (regex.test(normalizedText)) {
                    flaggedWords.push(word);
                    reason = 'potentially_inappropriate';
                }
            }
        }

        return {
            isValid: flaggedWords.length === 0,
            flaggedWords: flaggedWords,
            reason: reason
        };
    }

    /**
     * Validate project data
     * @param {object} projectData - Project data to validate
     * @returns {object} - Validation result
     */
    validateProject(projectData) {
        const fieldsToCheck = [
            { field: 'title', value: projectData.title, required: true },
            { field: 'description', value: projectData.description, required: true },
            { field: 'requirements.description', value: projectData.requirements?.description },
            { field: 'deliverables', value: projectData.requirements?.deliverables?.join(' ') },
            { field: 'milestones', value: this.extractMilestoneText(projectData.requirements?.milestones) },
            { field: 'screening questions', value: this.extractScreeningQuestions(projectData.applicationSettings?.screeningQuestions) }
        ];

        const validationResults = [];
        let hasViolations = false;

        for (const { field, value, required } of fieldsToCheck) {
            if (!value) {
                if (required) {
                    validationResults.push({
                        field,
                        isValid: false,
                        reason: 'required_field_missing'
                    });
                    hasViolations = true;
                }
                continue;
            }

            const result = this.validateContent(value);
            validationResults.push({
                field,
                ...result
            });

            if (!result.isValid) {
                hasViolations = true;
            }
        }

        return {
            isValid: !hasViolations,
            results: validationResults,
            violatedFields: validationResults.filter(r => !r.isValid)
        };
    }

    /**
     * Extract text from milestones for validation
     */
    extractMilestoneText(milestones) {
        if (!milestones || !Array.isArray(milestones)) return '';
        return milestones.map(m => `${m.title || ''} ${m.description || ''}`).join(' ');
    }

    /**
     * Extract text from screening questions for validation
     */
    extractScreeningQuestions(questions) {
        if (!questions || !Array.isArray(questions)) return '';
        return questions.map(q => q.question || '').join(' ');
    }

    /**
     * Get user-friendly error message
     */
    getErrorMessage(violatedFields) {
        if (!violatedFields || violatedFields.length === 0) {
            return 'Content validation passed';
        }

        const inappropriateFields = violatedFields.filter(f => f.reason === 'inappropriate_content');

        if (inappropriateFields.length > 0) {
            return 'Your project contains inappropriate content that violates our community guidelines. Please review and modify your content to ensure it\'s professional and appropriate.';
        }

        return 'Your project content needs review. Please ensure all content is professional and appropriate.';
    }

    /**
     * Log content violations for monitoring
     */
    logViolation(userId, projectData, violatedFields) {
        console.log('Content Violation Detected:', {
            userId,
            timestamp: new Date(),
            projectTitle: projectData.title,
            violatedFields: violatedFields.map(f => ({
                field: f.field,
                reason: f.reason,
                // Don't log the actual flagged words for privacy
                wordCount: f.flaggedWords?.length || 0
            }))
        });
    }
}

export default new ContentFilter();
