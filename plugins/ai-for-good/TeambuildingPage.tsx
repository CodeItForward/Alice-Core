import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Save, Users, ChevronDown, CheckCircle, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/context/AuthContext';
import { 
  getUserTeamsByType, 
  getStudentProfileByUserAndClass, 
  getStudentProfileByUserId,
  createStudentProfile, 
  updateStudentProfile,
  type Team,
  type StudentProfile
} from '../../core/services/api';
import { RESTRICTED_CHAT_API } from '../../core/config/api';



interface TeambuildingForm {
  firstName: string;
  animal: string;
  iceCream: string;
  funFact: string;
  travelLocation: string;
  laughTrigger: string;
  proudOf: string;
  buildIdea: string;
  whoToHelp: string;
  worldChange: string;
  mayorForDay: string;
}

interface TeamTheme {
  name: string;
  description: string;
  students: string[];
  rationale: string;
  suggestions: string[];
}

interface TeamAnalysis {
  summary: string;
  themes: TeamTheme[];
}

// Add type for team member
interface TeamMember {
  TeamMemberId: number;
  TeamId: number;
  Role: string | null;
  JoinedAt: string;
  user: {
    UserId: number;
    DisplayName: string;
    Email: string;
  };
}







const TeambuildingPage: React.FC = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [currentProfile, setCurrentProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<TeamAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const analysisSectionRef = useRef<HTMLDivElement>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TeambuildingForm>({
    firstName: '',
    animal: '',
    iceCream: '',
    funFact: '',
    travelLocation: '',
    laughTrigger: '',
    proudOf: '',
    buildIdea: '',
    whoToHelp: '',
    worldChange: '',
    mayorForDay: ''
  });

  // Debug user state
  useEffect(() => {
    console.log('=== TEAMBUILDING PAGE: USER STATE CHANGED ===');
    console.log('User:', user);
    console.log('Is Loading:', isLoading);
    console.log('Error:', error);
  }, [user, isLoading, error]);

  // Debug form data changes
  useEffect(() => {
    console.log('=== TEAMBUILDING PAGE: FORM DATA CHANGED ===');
    console.log('Form Data:', JSON.stringify(formData, null, 2));
    console.log('Has Data:', Object.values(formData).some(value => value.trim() !== ''));
  }, [formData]);

  // Debug currentProfile changes
  useEffect(() => {
    console.log('=== TEAMBUILDING PAGE: CURRENT PROFILE CHANGED ===');
    console.log('Current Profile:', currentProfile);
    console.log('Current Profile ID:', currentProfile?.id);
  }, [currentProfile]);

  // Load teams for user (type 4)
  useEffect(() => {
    const loadTeams = async () => {
      console.log('=== TEAMBUILDING PAGE: LOADING TEAMS ===');
      console.log('User:', user);
      
      if (!user) {
        console.log('No user available, setting loading to false');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Loading teams for user:', user.id, 'type: 4');
        const fetchedTeams = await getUserTeamsByType(parseInt(user.id), 4);
        console.log('Loaded teams:', fetchedTeams);
        setTeams(fetchedTeams);
        
        // Select the team with the highest TeamId
        if (fetchedTeams.length > 0) {
          const highestTeam = fetchedTeams.reduce((prev, current) => 
            (prev.TeamId > current.TeamId) ? prev : current
          );
          console.log('Selected highest team:', highestTeam);
          setSelectedTeam(highestTeam);
        } else {
          console.log('No teams found for user');
          setError('No teams found for this user');
        }
      } catch (err) {
        console.error('Error loading teams:', err);
        setError('Failed to load teams');
      } finally {
        console.log('Setting loading to false');
        setIsLoading(false);
      }
    };

    loadTeams();
  }, [user]);

  // Load student profile when team is selected
  useEffect(() => {
    const loadStudentProfile = async () => {
      if (!user || !selectedTeam) return;
      
      setIsLoadingProfile(true);
      setError(null);
      
      try {
        console.log('=== TEAMBUILDING PAGE: LOADING STUDENT PROFILE ===');
        console.log('User ID:', user.id);
        console.log('Selected Team:', selectedTeam);
        console.log('Using team ID as class ID:', selectedTeam.TeamId);
        
        // Always get profile by user and class (team ID)
        const profile = await getStudentProfileByUserAndClass(parseInt(user.id), selectedTeam.TeamId);
        
        if (profile) {
          console.log('=== TEAMBUILDING PAGE: PROFILE FOUND ===');
          console.log('Profile Data:', JSON.stringify(profile, null, 2));
          console.log('Profile ID field:', profile.id);
          console.log('Profile ID type:', typeof profile.id);
          console.log('All profile keys:', Object.keys(profile));
          setCurrentProfile(profile);
          setProfileLoaded(true);
          
          // Only populate form if it's currently empty or if we have new data
          const hasExistingData = Object.values(formData).some(value => value.trim() !== '');
          const newFormData = {
            firstName: profile.first_name || '',
            animal: profile.animal || '',
            iceCream: profile.ice_cream || '',
            funFact: profile.fun_fact || '',
            travelLocation: profile.travel_location || '',
            laughTrigger: profile.laugh_trigger || '',
            proudOf: profile.proud_of || '',
            buildIdea: profile.build_idea || '',
            whoToHelp: profile.who_to_help || '',
            worldChange: profile.world_change || '',
            mayorForDay: profile.mayor_for_day || ''
          };
          
          // Only update form if we don't have existing data or if the profile data is different
          if (!hasExistingData || JSON.stringify(formData) !== JSON.stringify(newFormData)) {
            console.log('Setting form data:', JSON.stringify(newFormData, null, 2));
            setFormData(newFormData);
          } else {
            console.log('Form already has data, not overwriting');
          }
        } else {
          console.log('=== TEAMBUILDING PAGE: NO PROFILE FOUND ===');
          console.log('No existing profile found for user and class, will create new one on submit');
          setProfileLoaded(false);
          
          // Only clear form if it's currently empty to avoid losing user input
          const hasExistingData = Object.values(formData).some(value => value.trim() !== '');
          if (!hasExistingData) {
            const emptyFormData = {
              firstName: '',
              animal: '',
              iceCream: '',
              funFact: '',
              travelLocation: '',
              laughTrigger: '',
              proudOf: '',
              buildIdea: '',
              whoToHelp: '',
              worldChange: '',
              mayorForDay: ''
            };
            console.log('Setting empty form data:', JSON.stringify(emptyFormData, null, 2));
            setFormData(emptyFormData);
          } else {
            console.log('Form has existing data, keeping it');
          }
        }
      } catch (err) {
        console.error('Error loading student profile:', err);
        setError('Failed to load student profile');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadStudentProfile();
  }, [user, selectedTeam]);

  // Reset profile loaded state when team changes
  useEffect(() => {
    setProfileLoaded(false);
  }, [selectedTeam]);

  // Reset analysis state when team changes
  useEffect(() => {
    setShowAnalysis(false);
    setAnalysisResults(null);
  }, [selectedTeam]);

  // Fetch team members when selectedTeam changes
  useEffect(() => {
    if (!selectedTeam) return;
    setIsLoadingMembers(true);
    setMembersError(null);
    fetch(`https://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io/teams/${selectedTeam.TeamId}/members`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch team members');
        return res.json();
      })
      .then((data: TeamMember[]) => setTeamMembers(data))
      .catch(err => setMembersError(err.message))
      .finally(() => setIsLoadingMembers(false));
  }, [selectedTeam]);

  const handleInputChange = (field: keyof TeambuildingForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const analyzeTeam = async () => {
    if (!selectedTeam) {
      setError('No team selected for analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('=== TEAMBUILDING PAGE: ANALYZING TEAM ===');
      console.log('Selected Team:', selectedTeam);
      console.log('Team ID being used for analysis:', selectedTeam.TeamId);
      console.log('Current Profile Team ID:', currentProfile?.team_id);
      console.log('Analysis URL:', `${RESTRICTED_CHAT_API}/student-profiles/team/${selectedTeam.TeamId}/analyze`);
      
      const response = await fetch(`${RESTRICTED_CHAT_API}/student-profiles/team/${selectedTeam.TeamId}/analyze`);
      
      console.log('Analysis Response Status:', response.status, response.statusText);
      console.log('Analysis Response Headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Analysis API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        // If the selected team has no profiles, try with the profile's team ID
        if (response.status === 404 && currentProfile?.team_id && currentProfile.team_id !== selectedTeam.TeamId) {
          console.log('Selected team has no profiles, trying with profile team ID:', currentProfile.team_id);
          
          const fallbackResponse = await fetch(`${RESTRICTED_CHAT_API}/student-profiles/team/${currentProfile.team_id}/analyze`);
          
          if (fallbackResponse.ok) {
            const fallbackResults = await fallbackResponse.json();
            console.log('Fallback Analysis Results:', JSON.stringify(fallbackResults, null, 2));
            setAnalysisResults(fallbackResults);
            setShowAnalysis(true);
            return;
          } else {
            const fallbackErrorText = await fallbackResponse.text();
            console.error('Fallback Analysis API Error:', {
              status: fallbackResponse.status,
              statusText: fallbackResponse.statusText,
              body: fallbackErrorText
            });
          }
        }
        
        throw new Error(`Failed to analyze team: ${response.statusText} - ${errorText}`);
      }
      
      const results = await response.json();
      console.log('Analysis Results:', JSON.stringify(results, null, 2));
      
      setAnalysisResults(results);
      setShowAnalysis(true);
      
      // Scroll to analysis section after a short delay to ensure it's rendered
      setTimeout(() => {
        if (analysisSectionRef.current) {
          analysisSectionRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } catch (err) {
      console.error('Error analyzing team:', err);
      setError('Failed to analyze team. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedTeam) {
      setError('User or team not available');
      return;
    }
    
    console.log('=== TEAMBUILDING PAGE: FORM SUBMIT ===');
    console.log('User:', user);
    console.log('Selected Team:', selectedTeam);
    console.log('Current Profile:', currentProfile);
    console.log('Current Profile ID:', currentProfile?.id);
    console.log('Form Data:', JSON.stringify(formData, null, 2));
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (currentProfile) {
        // Update existing profile
        console.log('=== TEAMBUILDING PAGE: UPDATING EXISTING PROFILE ===');
        console.log('Current Profile Object:', JSON.stringify(currentProfile, null, 2));
        console.log('Profile ID to update:', currentProfile.id);
        
        let profileToUpdate = currentProfile;
        
        if (!currentProfile.id) {
          console.log('Profile ID is missing, trying to re-fetch profile...');
          // Try to re-fetch the profile by user and class
          const refreshedProfile = await getStudentProfileByUserAndClass(parseInt(user.id), selectedTeam.TeamId);
          
          if (refreshedProfile && refreshedProfile.id) {
            console.log('Successfully re-fetched profile with ID:', refreshedProfile.id);
            setCurrentProfile(refreshedProfile);
            profileToUpdate = refreshedProfile;
          } else {
            throw new Error('Could not find profile with valid ID for this user and class');
          }
        }
        
        const updateData = {
          first_name: formData.firstName,
          fun_fact: formData.funFact,
          animal: formData.animal,
          ice_cream: formData.iceCream,
          travel_location: formData.travelLocation,
          laugh_trigger: formData.laughTrigger,
          proud_of: formData.proudOf,
          build_idea: formData.buildIdea,
          who_to_help: formData.whoToHelp,
          world_change: formData.worldChange,
          mayor_for_day: formData.mayorForDay
        };
        console.log('Update data to send:', JSON.stringify(updateData, null, 2));
        
        const updatedProfile = await updateStudentProfile(profileToUpdate.id, updateData);
        setCurrentProfile(updatedProfile);
        console.log('Profile updated successfully:', updatedProfile);
      } else {
        // Try to create new profile
        console.log('=== TEAMBUILDING PAGE: CREATING NEW PROFILE ===');
        
        const createData = {
          user_id: parseInt(user.id),
          class_id: selectedTeam.TeamId, // Using team ID as class ID
          team_id: selectedTeam.TeamId,
          first_name: formData.firstName,
          fun_fact: formData.funFact,
          animal: formData.animal,
          ice_cream: formData.iceCream,
          travel_location: formData.travelLocation,
          laugh_trigger: formData.laughTrigger,
          proud_of: formData.proudOf,
          build_idea: formData.buildIdea,
          who_to_help: formData.whoToHelp,
          world_change: formData.worldChange,
          mayor_for_day: formData.mayorForDay
        };
        console.log('Create data to send:', JSON.stringify(createData, null, 2));
        
        try {
          const newProfile = await createStudentProfile(createData);
          setCurrentProfile(newProfile);
          console.log('Profile created successfully:', newProfile);
        } catch (createError: any) {
          // If creation fails with "already exists" error, try to find and update existing profile
          if (createError.message && createError.message.includes('already exists')) {
            console.log('=== TEAMBUILDING PAGE: PROFILE ALREADY EXISTS, TRYING TO UPDATE ===');
            
            // Try to find existing profile by user and class
            const existingProfile = await getStudentProfileByUserAndClass(parseInt(user.id), selectedTeam.TeamId);
            
            if (existingProfile) {
              console.log('Found existing profile, updating instead:', existingProfile.id);
              setCurrentProfile(existingProfile);
              
              const updateData = {
                first_name: formData.firstName,
                fun_fact: formData.funFact,
                animal: formData.animal,
                ice_cream: formData.iceCream,
                travel_location: formData.travelLocation,
                laugh_trigger: formData.laughTrigger,
                proud_of: formData.proudOf,
                build_idea: formData.buildIdea,
                who_to_help: formData.whoToHelp,
                world_change: formData.worldChange,
                mayor_for_day: formData.mayorForDay
              };
              
              const updatedProfile = await updateStudentProfile(existingProfile.id, updateData);
              setCurrentProfile(updatedProfile);
              console.log('Profile updated successfully after creation failed:', updatedProfile);
            } else {
              throw new Error('Profile already exists but could not be found for this user and class');
            }
          } else {
            throw createError;
          }
        }
      }
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving student profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="h-full bg-gray-50">
      {/* Main Content Area */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Teambuilding</h3>
                <p className="text-gray-500">Build your team profile and connect with your teammates</p>
              </div>
            
            {/* Team Selection */}
            {teams.length > 0 && (
              <div className="relative">
                <select
                  value={selectedTeam?.TeamId || ''}
                  onChange={(e) => {
                    const team = teams.find(t => t.TeamId === parseInt(e.target.value));
                    setSelectedTeam(team || null);
                  }}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {teams.map((team) => (
                    <option key={team.TeamId} value={team.TeamId}>
                      {team.Name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-gray-600">Loading...</span>
              </div>
            )}

            {/* Analysis Loading State */}
            {isAnalyzing && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Analyzing Your Team</h3>
                  <p className="text-gray-600">We're analyzing your team's responses to identify themes and suggest activities...</p>
                </div>
              </div>
            )}

            {/* Team Members Display */}
            {selectedTeam && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2 flex items-center"><Users className="w-5 h-5 mr-2" />Team Members</h2>
                {isLoadingMembers ? (
                  <div className="text-gray-500">Loading team members...</div>
                ) : membersError ? (
                  <div className="text-red-500">{membersError}</div>
                ) : teamMembers.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {teamMembers.map(member => (
                      <span key={member.TeamMemberId} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        {member.user.DisplayName}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">No team members found.</div>
                )}
              </div>
            )}

            {/* Form Content */}
            {!isLoading && !showAnalysis && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center mb-6">
                  <Users className="text-purple-600 mr-3" size={16} />
                  <h2 className="text-2xl font-bold text-gray-800">Teambuilding</h2>
                </div>
                
                <div className="prose prose-lg max-w-none mb-6">
                  <p className="text-gray-600">
                    Let's get to know each other better! Fill out this form to share some fun facts about yourself. 
                    Your responses will help us build a stronger, more connected team.
                  </p>
                </div>

                {/* Profile Loading State */}
                {isLoadingProfile && (
                  <div className="flex items-center justify-center py-8 mb-6 bg-gray-50 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-3"></div>
                    <span className="text-gray-600">Loading your previous responses...</span>
                  </div>
                )}

                {/* Profile Loaded Success Message */}
                {profileLoaded && !isLoadingProfile && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="text-green-600 mr-2" size={16} />
                      <span className="text-green-800 font-medium">Your previous responses have been loaded!</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      What's your first name or nickname?
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      maxLength={100}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your first name or nickname"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.firstName.length}/100 characters
                    </div>
                  </div>

                  {/* Animal */}
                  <div>
                    <label htmlFor="animal" className="block text-sm font-medium text-gray-700 mb-2">
                      If you were an animal, what would you be and why?
                    </label>
                    <textarea
                      id="animal"
                      value={formData.animal}
                      onChange={(e) => handleInputChange('animal', e.target.value)}
                      maxLength={100}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., A dolphin because I love swimming and being social"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.animal.length}/100 characters
                    </div>
                  </div>

                  {/* Ice Cream */}
                  <div>
                    <label htmlFor="iceCream" className="block text-sm font-medium text-gray-700 mb-2">
                      What's your favorite ice cream flavor?
                    </label>
                    <input
                      type="text"
                      id="iceCream"
                      value={formData.iceCream}
                      onChange={(e) => handleInputChange('iceCream', e.target.value)}
                      maxLength={100}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Mint chocolate chip"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.iceCream.length}/100 characters
                    </div>
                  </div>

                  {/* Fun Fact */}
                  <div>
                    <label htmlFor="funFact" className="block text-sm font-medium text-gray-700 mb-2">
                      What's one fun fact about you?
                    </label>
                    <textarea
                      id="funFact"
                      value={formData.funFact}
                      onChange={(e) => handleInputChange('funFact', e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Share something interesting about yourself!"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.funFact.length}/500 characters
                    </div>
                  </div>

                  {/* Travel Location */}
                  <div>
                    <label htmlFor="travelLocation" className="block text-sm font-medium text-gray-700 mb-2">
                      If you could travel anywhere in the world for two weeks, where would you go?
                    </label>
                    <textarea
                      id="travelLocation"
                      value={formData.travelLocation}
                      onChange={(e) => handleInputChange('travelLocation', e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe your dream destination and why you'd go there"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.travelLocation.length}/500 characters
                    </div>
                  </div>

                  {/* Laugh Trigger */}
                  <div>
                    <label htmlFor="laughTrigger" className="block text-sm font-medium text-gray-700 mb-2">
                      What's something that makes you laugh?
                    </label>
                    <textarea
                      id="laughTrigger"
                      value={formData.laughTrigger}
                      onChange={(e) => handleInputChange('laughTrigger', e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Share something that makes you laugh!"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.laughTrigger.length}/500 characters
                    </div>
                  </div>

                  {/* Proud Of */}
                  <div>
                    <label htmlFor="proudOf" className="block text-sm font-medium text-gray-700 mb-2">
                      What's something you've made or helped with that you're proud of?
                    </label>
                    <textarea
                      id="proudOf"
                      value={formData.proudOf}
                      onChange={(e) => handleInputChange('proudOf', e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Share a project, achievement, or contribution you're proud of"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.proudOf.length}/500 characters
                    </div>
                  </div>

                  {/* Build Idea */}
                  <div>
                    <label htmlFor="buildIdea" className="block text-sm font-medium text-gray-700 mb-2">
                      If your team had a million dollars to make something awesome, what would it be?
                    </label>
                    <textarea
                      id="buildIdea"
                      value={formData.buildIdea}
                      onChange={(e) => handleInputChange('buildIdea', e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe an amazing project you'd create with a million dollars"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.buildIdea.length}/500 characters
                    </div>
                  </div>

                  {/* Who To Help */}
                  <div>
                    <label htmlFor="whoToHelp" className="block text-sm font-medium text-gray-700 mb-2">
                      If you could help one group of people, animals, or the planet, who would you help and how?
                    </label>
                    <textarea
                      id="whoToHelp"
                      value={formData.whoToHelp}
                      onChange={(e) => handleInputChange('whoToHelp', e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe who you'd help and your approach to making a difference"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.whoToHelp.length}/500 characters
                    </div>
                  </div>

                  {/* World Change */}
                  <div>
                    <label htmlFor="worldChange" className="block text-sm font-medium text-gray-700 mb-2">
                      What's one thing you'd change to make your school, town, or the world better?
                    </label>
                    <textarea
                      id="worldChange"
                      value={formData.worldChange}
                      onChange={(e) => handleInputChange('worldChange', e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Share an idea for positive change in your community or the world"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.worldChange.length}/500 characters
                    </div>
                  </div>

                  {/* Mayor for Day */}
                  <div>
                    <label htmlFor="mayorForDay" className="block text-sm font-medium text-gray-700 mb-2">
                      If you could be mayor for the day, what would you do?
                    </label>
                    <textarea
                      id="mayorForDay"
                      value={formData.mayorForDay}
                      onChange={(e) => handleInputChange('mayorForDay', e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe what you'd accomplish as mayor for a day"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.mayorForDay.length}/500 characters
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={analyzeTeam}
                      disabled={isAnalyzing || !selectedTeam}
                      className={`flex items-center px-6 py-2 rounded-lg ${
                        isAnalyzing || !selectedTeam
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Activity size={16} className="mr-2" />
                          Analyze Team
                        </>
                      )}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex items-center px-6 py-2 rounded-lg ${
                        isSubmitting
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          {currentProfile ? 'Update Profile' : 'Save Profile'}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Success Message */}
                  {isSaved && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <div className="flex items-center">
                        <CheckCircle className="text-green-600 mr-2" size={16} />
                        <span className="text-green-800 font-medium">Your profile has been saved successfully!</span>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Analysis Results */}
            {!isLoading && showAnalysis && analysisResults && (
              <div ref={analysisSectionRef} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Activity className="text-blue-600 mr-3" size={16} />
                    <h2 className="text-2xl font-bold text-gray-800">Team Analysis</h2>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        analyzeTeam();
                        // Scroll to top of analysis section when re-analyzing
                        setTimeout(() => {
                          if (analysisSectionRef.current) {
                            analysisSectionRef.current.scrollIntoView({ 
                              behavior: 'smooth',
                              block: 'start'
                            });
                          }
                        }, 100);
                      }}
                      disabled={isAnalyzing}
                      className={`flex items-center px-4 py-2 rounded-lg ${
                        isAnalyzing
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Activity size={16} className="mr-2" />
                          Re-analyze
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowAnalysis(false)}
                      className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                    >
                      <ArrowRight size={16} className="mr-2 rotate-180" />
                      Back to Form
                    </button>
                  </div>
                </div>

                {/* Team Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Summary</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{analysisResults.summary}</p>
                  </div>
                </div>

                {/* Team Themes */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">Team Themes</h3>
                  {analysisResults.themes.map((theme: TeamTheme, index: number) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                        <h4 className="text-lg font-semibold text-gray-800">{theme.name}</h4>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{theme.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">Students in this theme:</h5>
                          <div className="flex flex-wrap gap-2">
                            {theme.students.map((student: string, studentIndex: number) => (
                              <span
                                key={studentIndex}
                                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                              >
                                {student}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">Rationale:</h5>
                          <p className="text-gray-600 text-sm">{theme.rationale}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-800 mb-2">Suggested Activities:</h5>
                        <ul className="space-y-2">
                          {theme.suggestions.map((suggestion: string, suggestionIndex: number) => (
                            <li key={suggestionIndex} className="flex items-start">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-700 text-sm">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default TeambuildingPage; 