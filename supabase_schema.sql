-- 1. Users Table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    gender TEXT,
    birth_date DATE NOT NULL,
    birth_time TIME WITHOUT TIME ZONE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    timezone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Daily Signals Table (Cached momentum scores)
CREATE TABLE public.daily_signals (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    pillar TEXT NOT NULL, -- 'Overall', 'Career', 'Money', etc.
    score INTEGER CHECK (score >= 0 AND score <= 100),
    volatility TEXT, -- 'calm', 'dynamic', 'intense'
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, date, pillar)
);

-- 3. Interpretations Table (Cached LLM outputs)
CREATE TABLE public.interpretations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signal_hash TEXT UNIQUE NOT NULL, -- Hash of (user_id, date, pillar, score)
    summary TEXT NOT NULL,
    vector_origin TEXT,
    advised_action TEXT,
    risk_factors TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interpretations ENABLE ROW LEVEL SECURITY;
