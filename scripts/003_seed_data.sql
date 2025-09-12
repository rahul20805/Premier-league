-- Insert sample teams
INSERT INTO public.teams (name, logo_url, color, wins, losses, draws, points) VALUES
('Thunder Bolts', '/placeholder.svg?height=60&width=60', '#00ffcc', 5, 1, 2, 17),
('Fire Dragons', '/placeholder.svg?height=60&width=60', '#ff007f', 4, 2, 2, 14),
('Ice Wolves', '/placeholder.svg?height=60&width=60', '#00ccff', 3, 3, 2, 11),
('Storm Eagles', '/placeholder.svg?height=60&width=60', '#ff8c00', 2, 4, 2, 8);

-- Insert sample players
INSERT INTO public.players (name, team_id, position, jersey_number, photo_url, goals, assists, matches_played) VALUES
('Alex Johnson', (SELECT id FROM teams WHERE name = 'Thunder Bolts'), 'Forward', 10, '/placeholder.svg?height=100&width=100', 8, 3, 8),
('Sarah Chen', (SELECT id FROM teams WHERE name = 'Thunder Bolts'), 'Midfielder', 7, '/placeholder.svg?height=100&width=100', 4, 6, 8),
('Mike Rodriguez', (SELECT id FROM teams WHERE name = 'Fire Dragons'), 'Goalkeeper', 1, '/placeholder.svg?height=100&width=100', 0, 0, 8),
('Emma Wilson', (SELECT id FROM teams WHERE name = 'Fire Dragons'), 'Defender', 5, '/placeholder.svg?height=100&width=100', 1, 2, 8),
('James Park', (SELECT id FROM teams WHERE name = 'Ice Wolves'), 'Forward', 9, '/placeholder.svg?height=100&width=100', 6, 4, 8),
('Lisa Thompson', (SELECT id FROM teams WHERE name = 'Storm Eagles'), 'Midfielder', 8, '/placeholder.svg?height=100&width=100', 3, 5, 8);

-- Insert sample matches
INSERT INTO public.matches (home_team_id, away_team_id, home_score, away_score, status, match_date, venue) VALUES
((SELECT id FROM teams WHERE name = 'Thunder Bolts'), (SELECT id FROM teams WHERE name = 'Fire Dragons'), 2, 1, 'finished', NOW() - INTERVAL '2 days', 'Central Stadium'),
((SELECT id FROM teams WHERE name = 'Ice Wolves'), (SELECT id FROM teams WHERE name = 'Storm Eagles'), 1, 1, 'live', NOW(), 'North Field'),
((SELECT id FROM teams WHERE name = 'Thunder Bolts'), (SELECT id FROM teams WHERE name = 'Ice Wolves'), 0, 0, 'scheduled', NOW() + INTERVAL '3 days', 'Central Stadium'),
((SELECT id FROM teams WHERE name = 'Fire Dragons'), (SELECT id FROM teams WHERE name = 'Storm Eagles'), 0, 0, 'scheduled', NOW() + INTERVAL '5 days', 'South Arena');
