-- Add quiz system enhancements to training modules
ALTER TABLE public.safe_space_training_modules
ADD COLUMN IF NOT EXISTS max_attempts INTEGER,
ADD COLUMN IF NOT EXISTS retry_delay_days INTEGER,
ADD COLUMN IF NOT EXISTS question_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS difficulty_level TEXT NOT NULL DEFAULT 'medium';

-- Add retry tracking to training progress
ALTER TABLE public.safe_space_helper_training_progress
ADD COLUMN IF NOT EXISTS last_attempt_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS can_retry_at TIMESTAMPTZ;

-- Update Module 1: Understanding Safe Space & Crisis Support (15 questions)
UPDATE public.safe_space_training_modules
SET 
  content_type = 'quiz',
  question_count = 15,
  difficulty_level = 'medium',
  duration_minutes = 25,
  passing_score = 80,
  quiz_questions = '[
    {
      "id": 1,
      "question": "What is the primary principle of Safe Space?",
      "options": ["Providing medical advice", "Anonymous, judgment-free support", "Professional therapy", "Crisis intervention only"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Safe Space is built on anonymity and non-judgmental support, creating a safe environment for anyone seeking help."
    },
    {
      "id": 2,
      "question": "Why is anonymity important in Safe Space?",
      "options": ["It is legally required", "It reduces platform costs", "It removes barriers to seeking help and protects privacy", "It makes moderation easier"],
      "correct_answer": 2,
      "difficulty": "medium",
      "explanation": "Anonymity removes stigma and fear of judgment, making it easier for vulnerable individuals to reach out for support."
    },
    {
      "id": 3,
      "question": "A user shares they are feeling sad about a breakup. Is this a crisis?",
      "options": ["Yes, always treat breakups as crises", "No, this is emotional support, not a crisis", "Yes, if they mention the word ''sad''", "Only if they are crying"],
      "correct_answer": 1,
      "difficulty": "medium",
      "scenario": "User: ''I just broke up with my partner and feeling really sad.''",
      "explanation": "Sadness about a breakup is normal emotional distress, not a mental health crisis. Provide empathetic support."
    },
    {
      "id": 4,
      "question": "What should you NEVER do as a Safe Space helper?",
      "options": ["Listen actively", "Provide medical or psychiatric diagnoses", "Show empathy", "Ask clarifying questions"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Helpers are not medical professionals. Never diagnose or prescribe treatments. Your role is supportive listening."
    },
    {
      "id": 5,
      "question": "A user says ''I think I might have depression.'' What is the appropriate response?",
      "options": ["''You definitely have depression''", "''I hear you. Have you considered speaking with a mental health professional who can provide a proper assessment?''", "''You do not sound depressed to me''", "''Here is a list of medications you should try''"],
      "correct_answer": 1,
      "difficulty": "medium",
      "scenario": "User expresses self-diagnosis concern.",
      "explanation": "Validate their feelings, but redirect to professional assessment. Never confirm or deny diagnoses."
    },
    {
      "id": 6,
      "question": "What is your primary role as a Safe Space helper?",
      "options": ["To solve all their problems", "To provide empathetic, non-judgmental listening and emotional support", "To give medical advice", "To become their friend"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Your role is to listen, validate, and provide emotional support—not to fix, diagnose, or form personal relationships."
    },
    {
      "id": 7,
      "question": "Can you share details about a session with your friends?",
      "options": ["Yes, if I do not mention names", "No, all sessions are completely confidential", "Yes, if it is interesting", "Only if I get permission first"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Confidentiality is absolute. Never share session details, even anonymized, unless there is imminent danger."
    },
    {
      "id": 8,
      "question": "What does ''non-judgmental support'' mean?",
      "options": ["Agreeing with everything the user says", "Listening without criticism, blame, or personal opinions about their choices", "Never challenging harmful behaviors", "Avoiding difficult topics"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Non-judgmental means accepting their experience without imposing your values, while still maintaining boundaries."
    },
    {
      "id": 9,
      "question": "A user shares illegal activity. What should you do?",
      "options": ["Report to police immediately", "Continue supporting them without judgment, unless there is imminent harm to self or others", "End the session immediately", "Lecture them about the law"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User: ''I sometimes shoplift when I am stressed.''",
      "explanation": "Maintain non-judgmental support. Only breach confidentiality if there is immediate danger. Focus on underlying distress."
    },
    {
      "id": 10,
      "question": "What is the difference between empathy and sympathy?",
      "options": ["They are the same thing", "Empathy is understanding their feelings; sympathy is feeling sorry for them", "Sympathy is better than empathy", "Empathy means agreeing with them"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Empathy involves understanding and sharing their emotional experience. Sympathy is feeling pity, which can feel condescending."
    },
    {
      "id": 11,
      "question": "Why should you avoid giving direct advice?",
      "options": ["It is too much work", "It disempowers the user and removes their autonomy", "You should always give advice", "It takes too much time"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Giving advice can make users dependent and ignores their unique context. Help them explore their own solutions."
    },
    {
      "id": 12,
      "question": "What is emotional validation?",
      "options": ["Telling someone they are right", "Acknowledging and accepting someone''s feelings as real and understandable", "Solving their problems", "Agreeing with their actions"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Validation means recognizing their feelings as legitimate, even if you would feel differently in their situation."
    },
    {
      "id": 13,
      "question": "Can you share your own personal crisis stories during a session?",
      "options": ["Yes, it builds rapport", "Rarely, and only briefly if it helps them feel less alone—keep focus on them", "Yes, it shows you understand", "Always, it shows empathy"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User: ''I feel so alone in this.''",
      "explanation": "The session is about them, not you. Brief, relevant self-disclosure can help, but never shift focus to your story."
    },
    {
      "id": 14,
      "question": "What should you do if you feel overwhelmed during a session?",
      "options": ["Push through no matter what", "Take a break, use grounding techniques, or hand over to another helper if needed", "End the session abruptly", "Tell the user they are overwhelming you"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Your wellbeing matters. Recognize your limits, use self-care strategies, and escalate if needed. You cannot help others if you are depleted."
    },
    {
      "id": 15,
      "question": "What is the goal of a Safe Space session?",
      "options": ["To cure the user''s problems", "To provide a safe, supportive space where they feel heard and validated", "To give professional therapy", "To make them happy"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Success is creating a supportive environment. You are not there to fix or cure—just to listen and validate."
    }
  ]'::jsonb
WHERE title = 'Understanding Safe Space & Crisis Support';

-- Update Module 2: Active Listening Skills (15 questions)
UPDATE public.safe_space_training_modules
SET 
  content_type = 'quiz',
  question_count = 15,
  difficulty_level = 'medium',
  duration_minutes = 25,
  passing_score = 80,
  quiz_questions = '[
    {
      "id": 1,
      "question": "What is active listening?",
      "options": ["Waiting for your turn to speak", "Fully concentrating, understanding, responding, and remembering what is being said", "Nodding occasionally", "Thinking about advice while they talk"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Active listening requires full engagement with the speaker—mentally, verbally, and non-verbally."
    },
    {
      "id": 2,
      "question": "Which is an example of a reflective listening response?",
      "options": ["''You should try therapy''", "''It sounds like you are feeling really overwhelmed by work stress''", "''That is nothing, I had worse''", "''Why did you do that?''"],
      "correct_answer": 1,
      "difficulty": "medium",
      "scenario": "User: ''Work has been so stressful lately, I can barely sleep.''",
      "explanation": "Reflective responses paraphrase and reflect back emotions, showing you understand their experience."
    },
    {
      "id": 3,
      "question": "What is the purpose of asking open-ended questions?",
      "options": ["To end conversations quickly", "To encourage detailed responses and deeper exploration", "To confuse the user", "To show off your knowledge"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Open-ended questions (''How did that make you feel?'') invite elaboration, unlike closed questions (''Did that upset you?'')."
    },
    {
      "id": 4,
      "question": "A user pauses for a long time. What should you do?",
      "options": ["Fill the silence immediately", "Allow the silence—they may be processing emotions", "Change the topic", "Ask if they are still there"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User shares something painful, then goes silent for 30 seconds.",
      "explanation": "Silence is powerful. It gives them space to process. Rushing to fill it can interrupt their emotional work."
    },
    {
      "id": 5,
      "question": "What does paraphrasing demonstrate?",
      "options": ["That you are clever", "That you are listening and understanding their perspective", "That you can repeat words", "That you disagree"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Paraphrasing shows active engagement and allows them to clarify if you have misunderstood."
    },
    {
      "id": 6,
      "question": "Which response shows poor active listening?",
      "options": ["''That must be really difficult''", "''Have you tried just not thinking about it?''", "''Tell me more about that''", "''It sounds like you are feeling anxious''"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Dismissive advice (''just do not think about it'') invalidates their struggle and shows you are not truly listening."
    },
    {
      "id": 7,
      "question": "What is summarizing in active listening?",
      "options": ["Repeating everything word-for-word", "Briefly restating key points to show understanding and provide clarity", "Ending the conversation", "Giving your opinion"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Summarizing helps organize their thoughts, shows you have understood, and transitions between topics."
    },
    {
      "id": 8,
      "question": "Why is minimal encouragement (''mm-hmm'', ''I see'') important?",
      "options": ["It is just polite", "It signals you are engaged and encourages them to continue without interrupting their flow", "It fills awkward silences", "It shows you are bored"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Minimal encouragers show attentiveness without disrupting their narrative. They feel heard and supported."
    },
    {
      "id": 9,
      "question": "User: ''My mom died last year and I still cry every day.'' What is the best response?",
      "options": ["''You need to move on''", "''I am so sorry for your loss. It sounds like you are still grieving deeply. That must be incredibly painful''", "''At least she is not suffering''", "''My grandma died too''"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User shares ongoing grief.",
      "explanation": "Validate their pain, acknowledge the loss, and give them space to grieve without rushing them to ''move on''."
    },
    {
      "id": 10,
      "question": "What is the most important non-verbal active listening skill in text-based support?",
      "options": ["Using emojis", "Responding promptly and thoughtfully, matching their pace", "Using capital letters", "Sending long paragraphs"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "In text, response timing and pacing replace body language. Quick, thoughtful replies show you are present and engaged."
    },
    {
      "id": 11,
      "question": "Why should you avoid saying ''I understand exactly how you feel''?",
      "options": ["It is grammatically incorrect", "Everyone''s experience is unique—you cannot know exactly how they feel", "It is too informal", "It shows weakness"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Claiming exact understanding can feel dismissive. Instead say ''I hear how painful this is for you.''"
    },
    {
      "id": 12,
      "question": "What is the ''door opener'' technique?",
      "options": ["Ending the conversation", "An invitation for them to share more (''Would you like to talk about it?'')", "Changing topics", "Giving advice"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Door openers give permission to share without pressure, showing you are available and interested."
    },
    {
      "id": 13,
      "question": "User: ''I do not know why I am even talking about this.'' How should you respond?",
      "options": ["''Yeah, why are you?''", "''It is okay to talk about things that are bothering you. There is no judgment here''", "''You are wasting my time''", "''Let me change the subject''"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User expresses self-doubt about sharing.",
      "explanation": "Reassure them that their feelings matter and this is a safe space. Validate their decision to reach out."
    },
    {
      "id": 14,
      "question": "What is clarifying in active listening?",
      "options": ["Correcting their grammar", "Asking questions to ensure you have understood correctly", "Telling them they are wrong", "Ignoring confusing parts"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Clarifying (''When you say X, do you mean Y?'') prevents misunderstandings and shows careful attention."
    },
    {
      "id": 15,
      "question": "What is the biggest barrier to active listening?",
      "options": ["Lack of time", "Internal distractions—thinking about your response, judgment, or personal issues", "Not knowing the topic", "Poor typing skills"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "The biggest barrier is our own internal noise. Stay present and focus entirely on them, not on crafting your next response."
    }
  ]'::jsonb
WHERE title = 'Active Listening Skills';

-- Update Module 3: Recognizing Mental Health Crisis (20 questions)
UPDATE public.safe_space_training_modules
SET 
  content_type = 'quiz',
  question_count = 20,
  difficulty_level = 'hard',
  duration_minutes = 35,
  passing_score = 80,
  quiz_questions = '[
    {
      "id": 1,
      "question": "Which of the following is a warning sign of suicidal ideation?",
      "options": ["Talking about feeling hopeful", "Giving away possessions or saying goodbye", "Making future plans", "Increased appetite"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Giving away possessions or saying goodbye can indicate they are preparing to end their life. This requires immediate escalation."
    },
    {
      "id": 2,
      "question": "User says: ''I have been thinking it would be better if I was not here.'' What do you do?",
      "options": ["Change the subject to cheer them up", "Directly ask: ''Are you thinking about suicide?'' and assess immediate risk", "Tell them not to think that way", "Ignore it and hope they feel better"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User expresses passive suicidal ideation.",
      "explanation": "Direct, clear questions about suicide do NOT increase risk. Assess intent, plan, and means immediately."
    },
    {
      "id": 3,
      "question": "What is the difference between passive and active suicidal ideation?",
      "options": ["There is no difference", "Passive is wishing to be dead; active is planning to end one''s life", "Active is less serious", "Passive means they are joking"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Passive (''I wish I was not here'') vs. active (''I am planning to take pills tonight''). Both are serious, but active requires immediate intervention."
    },
    {
      "id": 4,
      "question": "What are the three key elements of suicide risk assessment?",
      "options": ["Age, gender, location", "Intent, plan, and means", "Mood, energy, appetite", "Friends, family, job"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Intent (do they want to die?), Plan (how specific?), Means (do they have access to method?). All three increase risk."
    },
    {
      "id": 5,
      "question": "User: ''I have pills and I am going to take them tonight.'' What is your immediate action?",
      "options": ["Encourage them to sleep on it", "Escalate immediately to emergency services—this is imminent risk", "Offer to talk tomorrow", "Tell them pills do not work"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User expresses active, imminent suicidal plan.",
      "explanation": "Specific plan + immediate timeframe + access to means = imminent danger. Contact emergency services immediately."
    },
    {
      "id": 6,
      "question": "What is a panic attack?",
      "options": ["A heart attack", "A sudden episode of intense fear with physical symptoms like rapid heartbeat, sweating, trembling", "Being very worried", "A seizure"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Panic attacks involve overwhelming fear and physical symptoms. They are frightening but not medically dangerous."
    },
    {
      "id": 7,
      "question": "How should you respond during a panic attack?",
      "options": ["Tell them to calm down", "Guide them through grounding techniques (5-4-3-2-1 senses, deep breathing)", "Leave them alone", "Distract them with jokes"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User: ''I cannot breathe, my heart is racing, I think I am dying.''",
      "explanation": "Stay calm, reassure them, guide breathing exercises, and use grounding techniques to bring them back to the present."
    },
    {
      "id": 8,
      "question": "What is a psychotic episode?",
      "options": ["Being very angry", "A break from reality involving hallucinations, delusions, or disorganized thinking", "A panic attack", "Depression"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Psychosis involves losing touch with reality. Signs include seeing/hearing things others do not, paranoia, or confused thinking."
    },
    {
      "id": 9,
      "question": "User: ''The government is watching me through my phone.'' How do you respond?",
      "options": ["''That is not real''", "Acknowledge their distress without confirming or denying the belief: ''That sounds really frightening. Have you been able to talk to a doctor?''", "''You are being paranoid''", "Argue with them about reality"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User may be experiencing paranoid delusions.",
      "explanation": "Do not argue with delusions. Validate their fear, maintain safety, and gently suggest professional help."
    },
    {
      "id": 10,
      "question": "When should you escalate to professional services?",
      "options": ["Whenever the user is sad", "When there is immediate risk of harm to self or others, psychosis, or severe mental health crisis", "Never", "Only if they ask"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Escalate for: suicidal intent, homicidal thoughts, psychosis, severe self-harm, or inability to care for self."
    },
    {
      "id": 11,
      "question": "What are common signs of severe depression requiring professional help?",
      "options": ["Feeling sad sometimes", "Inability to get out of bed, complete loss of interest, thoughts of death, not eating/sleeping for days", "Being tired", "Having a bad day"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Severe depression involves pervasive hopelessness, inability to function, and may include suicidal thoughts."
    },
    {
      "id": 12,
      "question": "User: ''I cut myself to feel something.'' How do you respond?",
      "options": ["''That is disgusting''", "''I hear you are in pain. Self-harm is a coping mechanism, but there are safer ways to manage these feelings. Have you considered professional support?''", "''Stop doing that immediately''", "Ignore it"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User discloses self-harm behavior.",
      "explanation": "Do not shame or dismiss. Acknowledge the pain behind self-harm and gently explore safer coping strategies and professional help."
    },
    {
      "id": 13,
      "question": "What is the goal when someone is in crisis?",
      "options": ["Fix their problems", "Ensure immediate safety, reduce distress, and connect them to appropriate resources", "Make them happy", "Give advice"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Crisis intervention focuses on safety stabilization and connection to help—not solving underlying issues."
    },
    {
      "id": 14,
      "question": "User: ''I am hearing voices telling me to hurt someone.'' What do you do?",
      "options": ["Tell them to ignore the voices", "Treat as a psychiatric emergency—assess immediate risk and escalate to emergency services", "Ask what the voices are saying out of curiosity", "Tell them voices are not real"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User experiencing command hallucinations with violent content.",
      "explanation": "Command hallucinations (especially violent) are a psychiatric emergency. Ensure safety and escalate immediately."
    },
    {
      "id": 15,
      "question": "What is dissociation?",
      "options": ["Forgetting someone''s name", "A disconnection from thoughts, feelings, memories, or sense of identity—often a trauma response", "Being distracted", "Disagreeing with someone"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Dissociation is a mental defense mechanism where someone disconnects from reality, often due to trauma or extreme stress."
    },
    {
      "id": 16,
      "question": "Signs of a manic episode include:",
      "options": ["Extreme tiredness", "Elevated mood, racing thoughts, decreased need for sleep, impulsive behavior, grandiosity", "Sadness", "Normal happiness"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Mania (in bipolar disorder) involves abnormally high energy, risky behavior, and impaired judgment. May require intervention."
    },
    {
      "id": 17,
      "question": "User: ''I have not slept in 4 days and I feel amazing, I am going to start 5 businesses today!'' What is your concern?",
      "options": ["They are very motivated", "Possible manic episode—lack of sleep, grandiosity, and impulsivity are warning signs", "They are just excited", "Nothing, this is normal"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User displaying possible manic symptoms.",
      "explanation": "Mania can lead to dangerous decisions. Gently express concern and suggest they speak to a healthcare provider."
    },
    {
      "id": 18,
      "question": "What is emotional numbing?",
      "options": ["Not caring about anything", "Inability to feel emotions, often a trauma or depression symptom", "Being calm", "Meditation"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Emotional numbing is a defense mechanism where someone feels detached from emotions, common in PTSD and severe depression."
    },
    {
      "id": 19,
      "question": "User: ''I cannot stop thinking about the trauma. I see it every time I close my eyes.'' What might this indicate?",
      "options": ["They need more sleep", "Possible PTSD with intrusive memories—suggest trauma-informed professional support", "They are being dramatic", "Normal memory"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User describing intrusive trauma memories.",
      "explanation": "Intrusive, uncontrollable trauma memories are a hallmark of PTSD. They need specialized trauma therapy."
    },
    {
      "id": 20,
      "question": "What is the most important thing to remember in crisis response?",
      "options": ["Have all the answers", "Prioritize safety above all else—yours and theirs", "Fix their problems immediately", "Never escalate"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Safety is paramount. If in doubt, escalate. You are not expected to handle all crises alone."
    }
  ]'::jsonb
WHERE title = 'Recognizing Mental Health Crisis';

-- Update Module 4: Boundaries & Self-Care (12 questions)
UPDATE public.safe_space_training_modules
SET 
  content_type = 'quiz',
  question_count = 12,
  difficulty_level = 'medium',
  duration_minutes = 20,
  passing_score = 80,
  quiz_questions = '[
    {
      "id": 1,
      "question": "Why are professional boundaries important?",
      "options": ["To seem professional", "To protect both you and the user from harm, dependency, and ethical violations", "To keep distance", "They are not important"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Boundaries create a safe, ethical framework that protects everyone and maintains the helping relationship."
    },
    {
      "id": 2,
      "question": "User asks for your phone number to talk outside the platform. What do you do?",
      "options": ["Give it to them", "Politely decline and explain boundaries: ''I can only support you through this platform to ensure safety and confidentiality''", "Give them your email instead", "Ignore the request"],
      "correct_answer": 1,
      "difficulty": "medium",
      "scenario": "User attempting to establish contact outside the platform.",
      "explanation": "Personal contact violates boundaries and removes protective oversight. Redirect to platform communication."
    },
    {
      "id": 3,
      "question": "What is vicarious trauma?",
      "options": ["Physical injury", "Experiencing trauma symptoms from repeated exposure to others'' traumatic stories", "Being directly traumatized", "Feeling empathy"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Vicarious trauma (secondary trauma) affects helpers who absorb others'' pain. Self-care and supervision are essential."
    },
    {
      "id": 4,
      "question": "What are signs of helper burnout?",
      "options": ["Feeling energized", "Emotional exhaustion, cynicism, reduced effectiveness, compassion fatigue", "Increased empathy", "Better sleep"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Burnout symptoms include exhaustion, detachment, irritability, and reduced capacity to help. Take breaks and seek support."
    },
    {
      "id": 5,
      "question": "How often should you take breaks from helping?",
      "options": ["Never, people need me", "Regularly, based on your capacity and emotional state—do not wait until burned out", "Only when forced", "Once a year"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Proactive self-care prevents burnout. Take regular breaks, set limits, and prioritize your mental health."
    },
    {
      "id": 6,
      "question": "User: ''You are the only one who understands me. I need to talk to you every day.'' What is the concern?",
      "options": ["They really like you", "They are becoming emotionally dependent, which is unhealthy and violates boundaries", "This is a compliment", "Nothing, this is good"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User showing signs of unhealthy dependency.",
      "explanation": "Dependency prevents their growth and places unsustainable burden on you. Gently redirect to professional ongoing support."
    },
    {
      "id": 7,
      "question": "What is an appropriate self-care practice for helpers?",
      "options": ["Ignoring your own needs", "Regular supervision/debriefing, hobbies, physical activity, therapy, social support", "Working more hours", "Isolating yourself"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Self-care is not selfish—it is essential. Engage in activities that recharge you emotionally and physically."
    },
    {
      "id": 8,
      "question": "Can you be friends with someone you helped on the platform?",
      "options": ["Yes, immediately", "No, this crosses professional boundaries and creates conflicts of interest", "Yes, after a week", "Only on social media"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Dual relationships (helper + friend) create ethical issues and harm the therapeutic nature of support."
    },
    {
      "id": 9,
      "question": "You feel emotionally drained after a difficult session. What should you do?",
      "options": ["Immediately start another session", "Take a break, practice self-care, debrief with a supervisor or peer if possible", "Push through the feeling", "Quit helping forever"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Acknowledge your limits. Taking care of yourself ensures you can continue helping effectively."
    },
    {
      "id": 10,
      "question": "What is compassion fatigue?",
      "options": ["Being too kind", "Emotional and physical exhaustion from caring for others, reducing your capacity for empathy", "Caring too much", "A medical condition"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Compassion fatigue is the cumulative toll of helping. It is reversible with rest, support, and boundary-setting."
    },
    {
      "id": 11,
      "question": "User shares graphic details of trauma. You feel disturbed. What do you do?",
      "options": ["Hide your feelings completely", "It is okay to acknowledge your reaction: ''That sounds incredibly difficult. I appreciate you sharing.'' Then debrief afterward", "Tell them it is too much", "End the session"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "Helper experiencing distress from graphic content.",
      "explanation": "Acknowledge your humanity. Brief emotional reactions are normal. Debrief with peers or supervisor after difficult sessions."
    },
    {
      "id": 12,
      "question": "Why should you not help when you are in personal crisis?",
      "options": ["You should always help", "Your own emotional state affects your ability to provide safe, effective support", "It shows weakness", "There is no reason"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "You cannot pour from an empty cup. Taking time for your own healing ensures you can help others effectively later."
    }
  ]'::jsonb
WHERE title = 'Boundaries & Self-Care for Helpers';

-- Update Module 5: Data Protection & Confidentiality (15 questions)
UPDATE public.safe_space_training_modules
SET 
  content_type = 'quiz',
  question_count = 15,
  difficulty_level = 'hard',
  duration_minutes = 25,
  passing_score = 80,
  quiz_questions = '[
    {
      "id": 1,
      "question": "What does GDPR stand for?",
      "options": ["General Data Protection Regulation", "Global Data Privacy Rule", "General Digital Protection Rights", "Government Data Protection Regulation"],
      "correct_answer": 0,
      "difficulty": "easy",
      "explanation": "GDPR is the EU regulation governing data protection and privacy for individuals."
    },
    {
      "id": 2,
      "question": "What is the main purpose of confidentiality in Safe Space?",
      "options": ["To comply with laws only", "To create trust and safety, allowing users to share openly without fear of exposure", "To keep secrets", "To protect the platform legally"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Confidentiality builds trust. Users must feel safe that their information will not be shared or used against them."
    },
    {
      "id": 3,
      "question": "Can you discuss session details in general terms without naming the user?",
      "options": ["Yes, that is fine", "No, even anonymized details can breach confidentiality and trust", "Only with friends", "Yes, if it is educational"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Even without names, sharing details can identify people or violate trust. Confidentiality is absolute unless there is imminent danger."
    },
    {
      "id": 4,
      "question": "When is it appropriate to breach confidentiality?",
      "options": ["Never", "Only when there is imminent risk of serious harm to the user or others", "When it is interesting", "When asked by family"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Confidentiality can be breached only for imminent danger (suicide, homicide, child abuse) or when legally required."
    },
    {
      "id": 5,
      "question": "User discloses they are abusing a child. What do you do?",
      "options": ["Keep it confidential", "Report immediately to authorities—child protection overrides confidentiality", "Convince them to stop", "Ignore it"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User discloses child abuse.",
      "explanation": "Child abuse is a mandatory reporting situation in most jurisdictions. Safety of the child is paramount."
    },
    {
      "id": 6,
      "question": "What is personally identifiable information (PII)?",
      "options": ["Only full names", "Any data that can identify an individual: name, email, location, IP address, etc.", "Only addresses", "Only phone numbers"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "PII includes any information that can identify someone directly or indirectly. Must be protected rigorously."
    },
    {
      "id": 7,
      "question": "How should you store session notes (if allowed by platform)?",
      "options": ["On your personal phone", "In secure, encrypted, platform-approved systems only", "In a notebook at home", "No need to store anything"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Notes must be stored securely, encrypted, and compliant with platform policies and data protection laws."
    },
    {
      "id": 8,
      "question": "User asks: ''Will you tell anyone what I said?'' How do you respond?",
      "options": ["''Never, I promise''", "''Everything shared is confidential, unless you are in immediate danger of harming yourself or others''", "''Maybe, it depends''", "''I have to report everything''"],
      "correct_answer": 1,
      "difficulty": "medium",
      "scenario": "User seeking confidentiality assurance.",
      "explanation": "Be honest about limits of confidentiality upfront. This builds informed trust."
    },
    {
      "id": 9,
      "question": "What is the principle of data minimization?",
      "options": ["Collecting as much data as possible", "Collecting only the data necessary for the specified purpose", "Deleting all data", "Sharing minimal data"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Data minimization means collecting only what is needed. Do not ask for or record unnecessary personal information."
    },
    {
      "id": 10,
      "question": "Can you access old sessions to learn about a returning user?",
      "options": ["Yes, always", "Only if the platform policy allows and the user is informed", "No, never", "Only for interesting cases"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Access to historical data must comply with platform policy, user consent, and data protection principles."
    },
    {
      "id": 11,
      "question": "User accidentally shares their full name and address. What do you do?",
      "options": ["Write it down for future reference", "Advise them to avoid sharing PII and do not record or use this information", "Thank them for sharing", "Share it with your supervisor"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User inadvertently shares identifying information.",
      "explanation": "Protect their privacy even from accidental disclosure. Gently redirect and do not record unnecessary PII."
    },
    {
      "id": 12,
      "question": "What is the right to erasure (right to be forgotten)?",
      "options": ["Users cannot delete their data", "Users can request deletion of their personal data under GDPR", "Only admins can delete data", "Data is never deleted"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "GDPR grants individuals the right to request deletion of their data under certain circumstances."
    },
    {
      "id": 13,
      "question": "Can you use session information for training purposes?",
      "options": ["Yes, always", "Only if fully anonymized and compliant with policies", "Yes, without asking", "No, never under any circumstances"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Anonymized data may be used for training/research only if permitted by policy and properly de-identified."
    },
    {
      "id": 14,
      "question": "A friend asks what you do as a volunteer. Can you share interesting cases?",
      "options": ["Yes, they are not users", "No, this violates confidentiality even outside the platform", "Yes, if you do not mention names", "Only if they promise not to tell"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Confidentiality extends beyond the platform. Never discuss cases socially, even anonymized."
    },
    {
      "id": 15,
      "question": "What should you do if you suspect a data breach (e.g., unauthorized access)?",
      "options": ["Ignore it", "Report immediately to platform administrators and follow data breach protocols", "Fix it yourself", "Tell the user"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Data breaches must be reported immediately. Timely response is critical for legal compliance and user protection."
    }
  ]'::jsonb
WHERE title = 'Data Protection & Confidentiality';

-- Update Module 6: De-escalation Techniques (15 questions)
UPDATE public.safe_space_training_modules
SET 
  content_type = 'quiz',
  question_count = 15,
  difficulty_level = 'hard',
  duration_minutes = 25,
  passing_score = 80,
  quiz_questions = '[
    {
      "id": 1,
      "question": "What is de-escalation?",
      "options": ["Making someone calm down forcefully", "Techniques to reduce intensity of conflict or emotional crisis to prevent harm", "Ignoring the problem", "Telling them to relax"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "De-escalation uses verbal and non-verbal techniques to defuse tense situations and restore calm."
    },
    {
      "id": 2,
      "question": "User is typing in all caps: ''I AM SO ANGRY I CANNOT TAKE THIS ANYMORE''. What is your first response?",
      "options": ["''Calm down''", "''I hear that you are really angry right now. That must be overwhelming. I am here to listen''", "''Stop yelling at me''", "Ignore them until they calm down"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User expressing intense anger through text.",
      "explanation": "Validate the emotion, show you are present, and provide space for them to express safely. Never say ''calm down''."
    },
    {
      "id": 3,
      "question": "What is the escalation cycle?",
      "options": ["Random mood swings", "Predictable stages: trigger → escalation → crisis → recovery", "Getting progressively angrier", "Mood disorders"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Understanding the escalation cycle helps identify early intervention points before crisis."
    },
    {
      "id": 4,
      "question": "What is the goal of de-escalation?",
      "options": ["To win the argument", "To reduce emotional intensity, ensure safety, and facilitate rational communication", "To make them agree with you", "To end the conversation quickly"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "De-escalation focuses on safety, emotional regulation, and restoring communication—not on being right."
    },
    {
      "id": 5,
      "question": "Which statement is LEAST helpful in de-escalation?",
      "options": ["''I understand this is frustrating''", "''You are overreacting''", "''Let us take this one step at a time''", "''I am here to help''"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "''You are overreacting'' invalidates their feelings and escalates conflict. Always validate emotional experience."
    },
    {
      "id": 6,
      "question": "User is becoming hostile toward you. What should you do?",
      "options": ["Argue back", "Stay calm, set a boundary: ''I want to help, but I need us to communicate respectfully''", "End session immediately", "Report them"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User directing anger at the helper.",
      "explanation": "Maintain calm, set clear boundaries, and redirect to respectful communication. Their anger may not be about you."
    },
    {
      "id": 7,
      "question": "What is active disengagement in de-escalation?",
      "options": ["Ignoring the person", "Temporarily stepping back to allow cooling down while remaining available", "Ending the relationship", "Blocking them"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Active disengagement gives space while maintaining connection: ''Let us take a 5-minute break and come back to this.''"
    },
    {
      "id": 8,
      "question": "Why is maintaining your own calm crucial in de-escalation?",
      "options": ["It shows you are cold", "Emotions are contagious—your calm can help regulate their emotional state", "It is professional", "It intimidates them"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Mirror neurons mean your emotional state affects theirs. Your calm presence can help them regain control."
    },
    {
      "id": 9,
      "question": "User: ''This is all your fault! You are not helping at all!'' Best response?",
      "options": ["''That is not true!''", "''I hear you are frustrated. Let us talk about what would be most helpful for you right now''", "''Fine, I will leave then''", "Defend yourself"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User blaming the helper in frustration.",
      "explanation": "Do not take it personally. Redirect to problem-solving and validate the underlying frustration."
    },
    {
      "id": 10,
      "question": "What is the ''broken record'' technique?",
      "options": ["Playing music", "Calmly repeating your key message without escalating", "Being annoying", "Arguing repeatedly"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Repeating a calm, consistent boundary or message (''I want to help, but we need to communicate respectfully'') without engaging in argument."
    },
    {
      "id": 11,
      "question": "When should you disengage from a session?",
      "options": ["Never", "When safety is at risk (threats, harassment) or when you are too emotionally affected to help effectively", "When bored", "When they disagree with you"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Know your limits. If the situation is unsafe or you are compromised, disengage and hand off to another helper."
    },
    {
      "id": 12,
      "question": "How can you de-escalate through text-based communication?",
      "options": ["Use all caps", "Use calm language, validate emotions, ask open questions, respond promptly but thoughtfully", "Ignore them until they calm down", "Send emojis only"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "In text, tone is conveyed through word choice and pacing. Stay calm, clear, and validating."
    },
    {
      "id": 13,
      "question": "User threatens self-harm during an angry outburst. What do you do?",
      "options": ["Assume they are bluffing", "Take it seriously—assess risk, de-escalate, and escalate to emergency services if needed", "Tell them not to do that", "End the session"],
      "correct_answer": 1,
      "difficulty": "hard",
      "scenario": "User makes self-harm threat during escalation.",
      "explanation": "Never dismiss threats, even in anger. Assess intent, provide support, and escalate if there is genuine risk."
    },
    {
      "id": 14,
      "question": "What is grounding, and how does it help in de-escalation?",
      "options": ["Punishing them", "Techniques to reconnect with the present moment (5-4-3-2-1 senses) to reduce emotional intensity", "Sending them outside", "Ignoring emotions"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Grounding helps people exit fight-or-flight mode by focusing on sensory present-moment experiences."
    },
    {
      "id": 15,
      "question": "After a crisis is de-escalated, what should you do?",
      "options": ["Immediately move on", "Gently debrief: acknowledge what happened, reinforce coping strategies, discuss next steps", "Never mention it again", "Celebrate"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Debriefing helps consolidate learning, reinforces positive coping, and prevents future escalation."
    }
  ]'::jsonb
WHERE title = 'De-escalation Techniques';

-- Create Module 7: Final Assessment (30 questions, comprehensive)
UPDATE public.safe_space_training_modules
SET 
  content_type = 'quiz',
  question_count = 30,
  difficulty_level = 'very_hard',
  duration_minutes = 50,
  passing_score = 85,
  max_attempts = 2,
  retry_delay_days = 7,
  quiz_questions = '[
    {
      "id": 1,
      "question": "What is the core principle that makes Safe Space effective?",
      "options": ["Professional expertise", "Anonymity and non-judgmental support", "Quick solutions", "Medical advice"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Safe Space works because it removes barriers through anonymity and creates safety through non-judgmental presence."
    },
    {
      "id": 2,
      "question": "You notice a user is hinting at suicidal thoughts but not stating it directly. What is your responsibility?",
      "options": ["Wait for them to bring it up clearly", "Ask directly and clearly: ''Are you having thoughts of suicide?''", "Change the subject", "Assume they are fine"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Direct questions about suicide are essential and do NOT increase risk. They open the door for assessment and support."
    },
    {
      "id": 3,
      "question": "A user shares they are being abused by their partner. What is your primary role?",
      "options": ["Tell them to leave immediately", "Provide validation, safety planning resources, and support their autonomy in decision-making", "Convince them the partner is bad", "Report to police without consent"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Respect autonomy. Provide resources and support without forcing decisions. Leaving abuse is complex and dangerous."
    },
    {
      "id": 4,
      "question": "Reflective listening involves:",
      "options": ["Repeating exactly what they said", "Paraphrasing their content and reflecting the underlying emotion", "Giving advice", "Staying silent"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Reflective listening shows understanding by capturing both the content and the emotional experience behind it."
    },
    {
      "id": 5,
      "question": "User: ''Nobody cares if I live or die.'' This is an example of:",
      "options": ["Attention-seeking", "Cognitive distortion that may indicate suicidal ideation—requires gentle exploration", "A fact", "Normal sadness"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "This is catastrophic thinking and potential suicidal ideation. Validate the pain and assess risk."
    },
    {
      "id": 6,
      "question": "What makes active listening different from passive hearing?",
      "options": ["Volume", "Full mental engagement, understanding, retention, and thoughtful response", "Nodding more", "Taking notes"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Active listening requires complete presence and engagement—understanding not just words, but meaning and emotion."
    },
    {
      "id": 7,
      "question": "User describes symptoms of psychosis. What should you NOT do?",
      "options": ["Validate their distress", "Argue about whether their perceptions are real", "Suggest professional evaluation", "Stay calm"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Never argue with delusions or hallucinations. Acknowledge their experience, maintain safety, guide toward professional help."
    },
    {
      "id": 8,
      "question": "Which boundary violation is most serious?",
      "options": ["Sharing your first name", "Developing a romantic relationship with a user", "Taking a 10-minute break", "Using humor appropriately"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Romantic/sexual relationships with users are severe ethical violations that cause harm and exploitation."
    },
    {
      "id": 9,
      "question": "What is the difference between sympathy and empathy in helping?",
      "options": ["No difference", "Sympathy is feeling sorry for someone; empathy is understanding and sharing their emotional experience", "Sympathy is better", "Empathy means solving problems"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Empathy creates connection and understanding. Sympathy can feel patronizing and creates distance."
    },
    {
      "id": 10,
      "question": "User discloses childhood sexual abuse. Your response should:",
      "options": ["Ask for graphic details", "Validate their courage in sharing, express that it was not their fault, and offer to support them in their healing", "Minimize it as ''in the past''", "Share your own trauma"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Trauma disclosure requires validation, reassurance of non-blame, and trauma-informed support without re-traumatization."
    },
    {
      "id": 11,
      "question": "When experiencing vicarious trauma, the best approach is:",
      "options": ["Ignore it and keep helping", "Acknowledge it, seek supervision/support, practice self-care, take breaks if needed", "Quit immediately", "Only help with easy cases"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Vicarious trauma is a normal occupational hazard. Address it proactively through support and self-care."
    },
    {
      "id": 12,
      "question": "Under GDPR, what is the lawful basis for processing user data in Safe Space?",
      "options": ["We can do whatever we want", "Legitimate interest or consent, with clear privacy policies and user rights", "Only with court order", "No legal basis needed"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "GDPR requires lawful basis (usually consent or legitimate interest), transparency, and respect for user rights."
    },
    {
      "id": 13,
      "question": "A user is escalating and using profanity directed at you. What is your first step?",
      "options": ["Match their energy", "Stay calm, set a boundary: ''I understand you are upset. I want to help, but I need us to communicate respectfully''", "Report them immediately", "End the session without explanation"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Maintain calm, set clear respectful boundaries, and redirect. Their anger is often displaced frustration."
    },
    {
      "id": 14,
      "question": "Silence during a session can indicate:",
      "options": ["They disconnected", "Processing emotions, reflecting, or struggling to articulate—give them space", "Boredom", "Disrespect"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Silence is valuable. Resist the urge to fill it immediately. Allow processing time."
    },
    {
      "id": 15,
      "question": "You realize you made a mistake in your response. What should you do?",
      "options": ["Hope they do not notice", "Acknowledge it openly and correct: ''I apologize, let me clarify what I meant...''", "Blame them for misunderstanding", "Ignore it"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Honesty and humility build trust. Acknowledge mistakes openly and model accountability."
    },
    {
      "id": 16,
      "question": "Which scenario requires immediate escalation to emergency services?",
      "options": ["User feeling sad about a breakup", "User stating: ''I have a gun and I am going to shoot myself tonight''", "User asking for advice", "User crying"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Specific, immediate plan with lethal means requires emergency intervention. Do not delay."
    },
    {
      "id": 17,
      "question": "What is the primary risk of helper burnout?",
      "options": ["Feeling tired", "Reduced effectiveness, potential harm to users, and personal mental health deterioration", "Wanting a vacation", "Working too much"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Burnout compromises your ability to help safely and effectively, and harms your own wellbeing."
    },
    {
      "id": 18,
      "question": "User: ''I have been cutting myself daily for months.'' What is your priority?",
      "options": ["Shame them to stop", "Assess current safety, understand function of self-harm, gently encourage professional support", "Tell their family", "Ignore it"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Self-harm is a coping mechanism. Assess immediate safety, explore underlying pain, and guide toward healthier coping and professional help."
    },
    {
      "id": 19,
      "question": "Why should you avoid giving advice even when asked?",
      "options": ["You do not know anything", "It removes their autonomy, may not fit their context, and creates dependency rather than empowerment", "It is too much work", "You should always give advice"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Advice disempowers. Instead, help them explore options and make their own informed decisions."
    },
    {
      "id": 20,
      "question": "What is trauma-informed care?",
      "options": ["Only helping people with trauma", "Understanding trauma''s impact and creating safety, trustworthiness, collaboration, and empowerment", "Avoiding trauma topics", "Diagnosing trauma"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Trauma-informed care recognizes trauma''s prevalence and impact, and structures support to avoid re-traumatization."
    },
    {
      "id": 21,
      "question": "A user asks ''Will this ever get better?'' What is the most helpful response?",
      "options": ["''Yes, definitely''", "''I hear how much pain you are in. With support and time, many people do find relief. What helps you hope, even a little?''", "''No, probably not''", "''Stop being negative''"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Avoid false promises or hopelessness. Validate pain, instill realistic hope, and explore existing coping/hope."
    },
    {
      "id": 22,
      "question": "What is the purpose of asking open-ended questions?",
      "options": ["To make conversation longer", "To encourage deeper exploration and give users space to express themselves fully", "To confuse them", "To test their knowledge"],
      "correct_answer": 1,
      "difficulty": "easy",
      "explanation": "Open questions (''How did that affect you?'') facilitate meaningful exploration versus closed questions (''Were you upset?'')."
    },
    {
      "id": 23,
      "question": "User mentions they stopped taking prescribed psychiatric medication. What should you do?",
      "options": ["Tell them to take it immediately", "Express concern, encourage them to discuss with their prescribing doctor, explore reasons without judgment", "Report them", "Agree with their decision"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Never advise on medication. Encourage medical consultation while exploring their concerns non-judgmentally."
    },
    {
      "id": 24,
      "question": "What does ''holding space'' mean?",
      "options": ["Physical location", "Being fully present with someone in their pain without trying to fix it", "Waiting in line", "Keeping secrets"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Holding space means being a compassionate witness to someone''s experience without needing to fix or change it."
    },
    {
      "id": 25,
      "question": "A user expresses frustration that you are not ''fixing'' their problems. How do you respond?",
      "options": ["''That is not my job''", "''I hear your frustration. My role is to support you in finding your own path forward. What feels most difficult right now?''", "''Fine, here is what to do''", "End the session"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Clarify your role as supporter, not fixer. Redirect to empowerment and collaborative problem-exploration."
    },
    {
      "id": 26,
      "question": "What is the most important factor in successful de-escalation?",
      "options": ["Being right", "Remaining calm and non-threatening while validating emotions", "Being loud", "Explaining logic"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Your calm presence and emotional validation are the foundation of de-escalation. Logic comes later."
    },
    {
      "id": 27,
      "question": "User shares they are experiencing command hallucinations to harm others. What is your immediate action?",
      "options": ["Explore their thoughts", "Treat as psychiatric emergency—assess immediate risk and escalate to emergency services", "Tell them hallucinations are not real", "Continue normal support"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Command hallucinations to harm others are a psychiatric emergency. Ensure safety and escalate immediately."
    },
    {
      "id": 28,
      "question": "Why is cultural competence important in helping?",
      "options": ["It is trendy", "Different cultures have different values, communication styles, and views on mental health—understanding this prevents misunderstanding and harm", "It is not important", "To seem educated"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Cultural competence ensures respectful, effective support that honors diverse perspectives and avoids imposing your worldview."
    },
    {
      "id": 29,
      "question": "What is your responsibility if you suspect a user is a minor in danger?",
      "options": ["Nothing, they are anonymous", "Follow platform protocols for safeguarding, which may include reporting to child protection services", "Keep it confidential", "Only tell your supervisor"],
      "correct_answer": 1,
      "difficulty": "hard",
      "explanation": "Child safeguarding overrides confidentiality in most jurisdictions. Follow platform protocols and legal requirements."
    },
    {
      "id": 30,
      "question": "What is the ultimate measure of successful support in Safe Space?",
      "options": ["Solving their problems", "The user feels heard, validated, and empowered, with reduced distress and maintained safety", "Making them happy", "Giving good advice"],
      "correct_answer": 1,
      "difficulty": "medium",
      "explanation": "Success is creating a safe space where they feel validated and supported, not fixing or curing them."
    }
  ]'::jsonb
WHERE title = 'Final Assessment';

-- Add comment explaining the quiz system
COMMENT ON COLUMN public.safe_space_training_modules.quiz_questions IS 'Array of quiz questions with id, question, options, correct_answer, difficulty, explanation, and optional scenario fields';
COMMENT ON COLUMN public.safe_space_training_modules.max_attempts IS 'Maximum number of attempts allowed (NULL = unlimited)';
COMMENT ON COLUMN public.safe_space_training_modules.retry_delay_days IS 'Days user must wait between failed attempts';
COMMENT ON COLUMN public.safe_space_training_modules.difficulty_level IS 'Overall difficulty: easy, medium, hard, very_hard';
COMMENT ON COLUMN public.safe_space_helper_training_progress.last_attempt_at IS 'Timestamp of most recent attempt';
COMMENT ON COLUMN public.safe_space_helper_training_progress.can_retry_at IS 'Timestamp when user can retry after failure (if retry_delay_days is set)';