-- Insert users
INSERT INTO "User" (id, name, email, "emailVerified", image, password, role) VALUES
(1, 'John Doe', 'john.doe@example.com', '2024-01-25T08:00:00Z', 'https://example.com/images/johndoe.jpg','$2b$10$9ltGJdFVKg2rApNWa8p5z.WVrxqIv9c.rZiaGMaOKLkMG.YifZMH6', 'admin'),
(3440, 'Byron Liao', 'byronliao00@gmail.com', '2024-01-25T09:00:00Z', 'https://example.com/images/janesmith.jpg', '$2b$10$9ltGJdFVKg2rApNWa8p5z.WVrxqIv9c.rZiaGMaOKLkMG.YifZMH6', 'founder'),
(3, 'Alice Johnson', 'alice.johnson@example.com', NULL, 'https://example.com/images/alicejohnson.jpg', '$2b$10$9ltGJdFVKg2rApNWa8p5z.WVrxqIv9c.rZiaGMaOKLkMG.YifZMH6', 'connector'),
(4, 'Bob Brown', 'bob.brown@example.com', '2024-01-25T10:00:00Z', 'https://example.com/images/bobbrown.jpg', '$2b$10$9ltGJdFVKg2rApNWa8p5z.WVrxqIv9c.rZiaGMaOKLkMG.YifZMH6', 'mentor'),
(5, 'Charlie Davis', 'charlie.davis@example.com', NULL, 'https://example.com/images/charliedavis.jpg','$2b$10$9ltGJdFVKg2rApNWa8p5z.WVrxqIv9c.rZiaGMaOKLkMG.YifZMH6', 'judge');