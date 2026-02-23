import { Presentation } from './components/Presentation/Presentation';
import { CoverSlide } from './components/Slides/CoverSlide';
import { ServicesSlide } from './components/Slides/ServicesSlide';
import { TarotSlide } from './components/Slides/TarotSlide';
import { QuoteSlide } from './components/Slides/QuoteSlide';
import { ContactSlide } from './components/Slides/ContactSlide';

import './index.css';

function App() {
  const slides = [
    CoverSlide,
    ServicesSlide,
    TarotSlide,
    QuoteSlide,
    ContactSlide
  ];

  return <Presentation slides={slides} />;
}

export default App;
