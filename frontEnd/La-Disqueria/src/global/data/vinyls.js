// src/modules/products/data/productsData.js
import chapellRoanImg from '@/assets/chappelRoan.png';
import dtmf from '@/assets/dtmf.png'
import Paramore from '@/assets/afterLaughter.png'
import joji from '@/assets/pissInTheWind.png'
import bitMe from '@/assets/biteme.png'

export const VINYLS_DATA = [
  {
    id: 1,
    slug: 'chappell-roan-princess',
    artist: 'Chappell Roan',
    album: 'The rise and fall of a midwest princess',
    price: 50.00,
    coverImage: chapellRoanImg, // Asumiendo que ya moviste las fotos a public
    vinylImage: chapellRoanImg,
    featured: true // Un extra para saber qué mostrar en el Home
  },
  {
    id: 2,
    slug: 'bad-bunny-fotos',
    artist: 'Bad Bunny',
    album: 'Debí tirar más fotos',
    price: 50.00,
    coverImage: dtmf,
    vinylImage: dtmf,
    featured: false
  },
  {
   id: 3,
    slug: 'Paramore After Laughter',
    artist: 'Paramore',
    album: 'After Laughter',
    price: 50.00,
    coverImage: Paramore,
    vinylImage: Paramore,
    featured: true
  },
   {
   id: 4,
    slug: 'piss-in-the-wind Joji',
    artist: 'Joji',
    album: 'Piss in the wind',
    price: 50.00,
    coverImage: joji,
    vinylImage: joji,
    featured: true
  },
  {
    id: 5,
    slug: 'renee-rapp-bite-me',
    artist: 'Reneé Rapp',
    album: 'BITE ME',
    price: 45.00,
    coverImage: bitMe,
    vinylImage: bitMe,
    featured: true
  }
 
];