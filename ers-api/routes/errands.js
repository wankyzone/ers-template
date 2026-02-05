import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

router.get('/available', async (req, res) => {
  const runnerId = req.headers['x-runner-id'];

  const { data, error } = await supabase
    .from('errands')
    .select('*')
    .or(`status.eq.created,assigned_runner_id.eq.${runnerId}`);

  if (error) return res.status(400).json({ error });

  res.json(data);
});

router.post('/:id/accept', async (req, res) => {
  const runnerId = req.headers['x-runner-id'];
  const { id } = req.params;

  const { data, error } = await supabase
    .from('errands')
    .update({
      status: 'accepted',
      assigned_runner_id: runnerId
    })
    .eq('id', id)
    .eq('status', 'created')
    .select()
    .single();

  if (error) return res.status(400).json({ error });

  res.json(data);
});

router.post('/:id/complete', async (req, res) => {
  const runnerId = req.headers['x-runner-id'];
  const { id } = req.params;

  const { data, error } = await supabase
    .from('errands')
    .update({ status: 'completed' })
    .eq('id', id)
    .eq('assigned_runner_id', runnerId)
    .select()
    .single();

  if (error) return res.status(400).json({ error });

  res.json(data);
});
