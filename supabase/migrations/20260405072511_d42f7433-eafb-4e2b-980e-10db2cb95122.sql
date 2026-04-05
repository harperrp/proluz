
-- Insert more lighting points for demo
INSERT INTO public.lighting_points (code, latitude, longitude, status, city_hall_id, address, neighborhood) VALUES
('P-004', -15.3971, -42.3105, 'FUNCIONANDO', '11111111-1111-1111-1111-111111111111', 'Rua São José, 120', 'Centro'),
('P-005', -15.3965, -42.3078, 'QUEIMADO', '11111111-1111-1111-1111-111111111111', 'Av. Brasil, 450', 'Centro'),
('P-006', -15.3998, -42.3115, 'FUNCIONANDO', '11111111-1111-1111-1111-111111111111', 'Rua da Paz, 78', 'Jardim América'),
('P-007', -15.4005, -42.3068, 'FUNCIONANDO', '11111111-1111-1111-1111-111111111111', 'Rua 7 de Setembro, 300', 'Centro'),
('P-008', -15.3952, -42.3095, 'QUEIMADO', '11111111-1111-1111-1111-111111111111', 'Av. Getúlio Vargas, 890', 'Vila Nova'),
('P-009', -15.3960, -42.3120, 'FUNCIONANDO', '11111111-1111-1111-1111-111111111111', 'Rua Minas Gerais, 55', 'Jardim América'),
('P-010', -15.4012, -42.3082, 'FUNCIONANDO', '11111111-1111-1111-1111-111111111111', 'Rua Bahia, 230', 'Vila Nova'),
('P-011', -15.3945, -42.3070, 'FUNCIONANDO', '11111111-1111-1111-1111-111111111111', 'Rua Goiás, 145', 'Centro'),
('P-012', -15.4020, -42.3100, 'QUEIMADO', '11111111-1111-1111-1111-111111111111', 'Rua Pernambuco, 67', 'Jardim América'),
('P-013', -15.3938, -42.3110, 'FUNCIONANDO', '11111111-1111-1111-1111-111111111111', 'Av. JK, 500', 'Centro'),
('P-014', -15.4030, -42.3060, 'FUNCIONANDO', '11111111-1111-1111-1111-111111111111', 'Rua Ceará, 88', 'Vila Nova'),
('P-015', -15.3980, -42.3130, 'FUNCIONANDO', '11111111-1111-1111-1111-111111111111', 'Rua Paraná, 190', 'Jardim América')
ON CONFLICT (code) DO NOTHING;

-- Insert complaints
INSERT INTO public.complaints (citizen_name, citizen_cpf, citizen_phone, city_hall_id, latitude, longitude, description, status, lighting_point_code, created_at) VALUES
('Maria Silva', '123.456.789-00', '(33) 99999-0001', '11111111-1111-1111-1111-111111111111', -15.3989, -42.3091, 'Poste apagado há 3 dias na Av. Principal. Rua completamente escura à noite.', 'PENDENTE', 'P-001', NOW() - INTERVAL '2 days'),
('João Santos', '987.654.321-00', '(33) 99999-0002', '11111111-1111-1111-1111-111111111111', -15.3965, -42.3078, 'Lâmpada piscando intermitentemente há uma semana.', 'PENDENTE', 'P-005', NOW() - INTERVAL '5 days'),
('Ana Oliveira', '456.789.123-00', '(33) 99999-0003', '11111111-1111-1111-1111-111111111111', -15.3952, -42.3095, 'Poste com fiação exposta, risco de choque elétrico.', 'APROVADA', 'P-008', NOW() - INTERVAL '10 days'),
('Carlos Souza', '321.654.987-00', '(33) 99999-0004', '11111111-1111-1111-1111-111111111111', -15.4020, -42.3100, 'Poste quebrado após acidente de trânsito.', 'APROVADA', 'P-012', NOW() - INTERVAL '7 days'),
('Fernanda Lima', '789.123.456-00', NULL, '11111111-1111-1111-1111-111111111111', -15.3971, -42.3105, 'Iluminação fraca na Rua São José, dificulta a visibilidade.', 'REJEITADA', NULL, NOW() - INTERVAL '15 days')
ON CONFLICT DO NOTHING;

-- Insert maintenance orders
INSERT INTO public.maintenance_orders (city_hall_id, lighting_point_code, status, priority, description, assigned_to) VALUES
('11111111-1111-1111-1111-111111111111', 'P-001', 'ABERTA', 'ALTA', 'Substituição de lâmpada queimada na Av. Principal', NULL),
('11111111-1111-1111-1111-111111111111', 'P-005', 'EM_EXECUCAO', 'MEDIA', 'Verificação de fiação e troca de reator', '07c08dfb-f96d-4293-8d91-afcdeaebe7a3'),
('11111111-1111-1111-1111-111111111111', 'P-008', 'ABERTA', 'ALTA', 'Reparo de fiação exposta - risco de segurança', NULL)
ON CONFLICT DO NOTHING;
