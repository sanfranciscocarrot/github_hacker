import express from 'express';
import { TradeService } from '../services/trade';

const router = express.Router();
const tradeService = new TradeService();

router.post('/calculate', async (req, res) => {
  try {
    const {
      sourcePlanet,
      destinationPlanet,
      goods,
      quantity,
      paymentType,
    } = req.body;

    if (!sourcePlanet || !destinationPlanet || !goods || !quantity || !paymentType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const result = await tradeService.calculateTrade({
      sourcePlanet,
      destinationPlanet,
      goods,
      quantity,
      paymentType,
    });

    res.json(result);
  } catch (error) {
    console.error('Trade calculation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as tradeRouter }; 