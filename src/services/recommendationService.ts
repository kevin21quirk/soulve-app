
import { supabase } from "@/integrations/supabase/client";
import { Recommendation } from "@/types/recommendations";

export interface UserPreference {
  id: string;
  user_id: string;
  preference_type: 'interest' | 'skill' | 'location_preference';
  preference_value: string;
  weight: number;
  created_at: string;
  updated_at: string;
}

export interface InteractionScore {
  id: string;
  user_id: string;
  target_user_id?: string;
  target_post_id?: string;
  interaction_type: 'view' | 'like' | 'share' | 'comment' | 'connect';
  score_value: number;
  created_at: string;
}

export class RecommendationService {
  // Store user preferences from profile data
  static async syncUserPreferences(userId: string) {
    try {
      // Get user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('skills, interests, location')
        .eq('id', userId)
        .maybeSingle();

      if (!profile) return;

      // Clear existing preferences
      await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', userId);

      const preferences: any[] = [];

      // Add skills as preferences
      if (profile.skills && Array.isArray(profile.skills)) {
        profile.skills.forEach((skill: string) => {
          preferences.push({
            user_id: userId,
            preference_type: 'skill',
            preference_value: skill.toLowerCase(),
            weight: 3.0
          });
        });
      }

      // Add interests as preferences
      if (profile.interests && Array.isArray(profile.interests)) {
        profile.interests.forEach((interest: string) => {
          preferences.push({
            user_id: userId,
            preference_type: 'interest',
            preference_value: interest.toLowerCase(),
            weight: 2.0
          });
        });
      }

      // Add location preference
      if (profile.location) {
        preferences.push({
          user_id: userId,
          preference_type: 'location_preference',
          preference_value: profile.location.toLowerCase(),
          weight: 1.5
        });
      }

      if (preferences.length > 0) {
        await supabase
          .from('user_preferences')
          .insert(preferences);
      }

      console.log(`Synced ${preferences.length} preferences for user ${userId}`);
    } catch (error) {
      console.error('Error syncing user preferences:', error);
    }
  }

  // Track user interactions for recommendation scoring
  static async trackInteraction(
    userId: string,
    interactionType: 'view' | 'like' | 'share' | 'comment' | 'connect',
    targetUserId?: string,
    targetPostId?: string
  ) {
    try {
      await supabase
        .from('user_interaction_scores')
        .upsert({
          user_id: userId,
          target_user_id: targetUserId,
          target_post_id: targetPostId,
          interaction_type: interactionType,
          score_value: this.getInteractionScore(interactionType)
        });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }

  private static getInteractionScore(interactionType: string): number {
    const scoreMap = {
      'view': 1,
      'like': 2,
      'share': 3,
      'comment': 4,
      'connect': 5
    };
    return scoreMap[interactionType as keyof typeof scoreMap] || 1;
  }

  // Generate recommendations using AI first, then fallback to database
  static async generateRecommendations(userId: string): Promise<Recommendation[]> {
    try {
      // First sync user preferences to ensure they're up to date
      await this.syncUserPreferences(userId);

      // Try AI-powered recommendations first
      try {
        const { data: aiData, error: aiError } = await supabase.functions.invoke(
          'ai-recommendations',
          {
            body: {
              userId,
              userPreferences: await this.getUserPreferences(userId),
              existingConnections: await this.getExistingConnections(userId)
            }
          }
        );

        if (!aiError && aiData?.recommendations?.length > 0) {
          console.log('Using AI-powered recommendations');
          return aiData.recommendations.map((rec: any) => ({
            id: `${rec.type}-${rec.targetId}`,
            type: rec.type as any,
            title: this.generateTitle(rec.type, rec.metadata),
            description: rec.reasoning,
            confidence: rec.confidence,
            reasoning: rec.reasoning,
            actionLabel: this.getActionLabel(rec.type),
            data: rec.metadata
          }));
        }
      } catch (aiError) {
        console.log('AI recommendations unavailable, using database fallback:', aiError);
      }

      // Fallback to database function
      const { data, error } = await supabase
        .rpc('generate_user_recommendations', { target_user_id: userId });

      if (error) {
        console.error('Error generating recommendations:', error);
        return [];
      }

      if (!data || data.length === 0) {
        console.log('No recommendations generated, returning fallback');
        return this.getFallbackRecommendations();
      }

      // Transform database results to Recommendation format
      const recommendations: Recommendation[] = data.map((item: any) => ({
        id: `${item.recommendation_type}-${item.target_id}`,
        type: item.recommendation_type as any,
        title: this.generateTitle(item.recommendation_type, item.metadata),
        description: this.generateDescription(item.recommendation_type, item.metadata),
        confidence: Math.round(item.confidence_score),
        reasoning: item.reasoning,
        actionLabel: this.getActionLabel(item.recommendation_type),
        data: item.metadata
      }));

      console.log(`Generated ${recommendations.length} recommendations for user ${userId}`);
      return recommendations;

    } catch (error) {
      console.error('Error in generateRecommendations:', error);
      return this.getFallbackRecommendations();
    }
  }

  private static async getUserPreferences(userId: string) {
    const { data } = await supabase
      .from('user_preferences')
      .select('preference_type, preference_value')
      .eq('user_id', userId);
    return data || [];
  }

  private static async getExistingConnections(userId: string) {
    const { data } = await supabase
      .from('connections')
      .select('requester_id, addressee_id')
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .eq('status', 'accepted');
    return data || [];
  }

  private static generateTitle(type: string, metadata: any): string {
    switch (type) {
      case 'connection':
        return `Connect with ${metadata.user}`;
      case 'help_opportunity':
        return `Help needed in ${metadata.location}`;
      case 'skill_match':
        return `Share your skills: ${metadata.subject || 'Tutoring opportunity'}`;
      case 'post':
        return metadata.title || 'Join this initiative';
      default:
        return 'New opportunity';
    }
  }

  private static generateDescription(type: string, metadata: any): string {
    switch (type) {
      case 'connection':
        return `${metadata.user} is in your area with similar interests`;
      case 'help_opportunity':
        return `Someone needs assistance in ${metadata.location}`;
      case 'skill_match':
        return `Your skills could help someone learn`;
      case 'post':
        return metadata.description || 'Join this community initiative';
      default:
        return 'A new opportunity for you';
    }
  }

  private static getActionLabel(type: string): string {
    switch (type) {
      case 'connection':
        return 'Send Request';
      case 'help_opportunity':
        return 'Offer Help';
      case 'skill_match':
        return 'Learn More';
      case 'post':
        return 'Join Project';
      default:
        return 'View Details';
    }
  }

  private static getFallbackRecommendations(): Recommendation[] {
    return [
      {
        id: "fallback-1",
        type: "connection",
        title: "Expand your network",
        description: "Complete your profile to get personalized connection suggestions",
        confidence: 70,
        reasoning: "Based on your current activity",
        actionLabel: "Update Profile",
        data: {
          user: "Community Members",
          location: "Your area",
          avatar: "",
          mutualConnections: 0,
          skills: []
        }
      }
    ];
  }

  // Cache recommendations for performance
  static async getCachedRecommendations(userId: string): Promise<Recommendation[]> {
    try {
      const { data } = await supabase
        .from('recommendation_cache')
        .select('*')
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString());

      if (data && data.length > 0) {
        return data.map(item => ({
          id: `${item.recommendation_type}-${item.target_id}`,
          type: item.recommendation_type as any,
          title: this.generateTitle(item.recommendation_type, item.metadata),
          description: this.generateDescription(item.recommendation_type, item.metadata),
          confidence: Math.round(item.confidence_score),
          reasoning: item.reasoning || 'Based on your preferences',
          actionLabel: this.getActionLabel(item.recommendation_type),
          data: item.metadata
        }));
      }

      // No cached recommendations, generate new ones
      return this.generateRecommendations(userId);
    } catch (error) {
      console.error('Error getting cached recommendations:', error);
      return this.generateRecommendations(userId);
    }
  }
}
