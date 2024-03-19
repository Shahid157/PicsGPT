import { supabase } from '../../../supabase';

export default async function handler(req, res) {
  try {
    const { price_range, color, gender , brand, style_type } = req.body.filters

    let supabaseQuery = supabase.from('Garments').select('*');

    if (price_range?.length > 0) {
      const priceFilters = price_range;
      supabaseQuery = supabaseQuery.in('price_filter', priceFilters);
    }

    if (color?.length > 0) {
      const colorArray = color;
      supabaseQuery = supabaseQuery.in('color', colorArray);
    }

    if (gender?.length > 0) {
        const genderArray = gender;
        supabaseQuery = supabaseQuery.in('gender', genderArray);
      }

      if (brand?.length > 0) {
        const brandArray = brand.map(item => item.toUpperCase());
        supabaseQuery = supabaseQuery.in('brand', brandArray);
      }
      

      if (style_type?.length > 0) {
        const style_typeArray = style_type;
        supabaseQuery = supabaseQuery.in('type', style_typeArray);
      }



    const { data, error } = await supabaseQuery;

    if (error) {
      console.error(error);
      return res.send([]);
    }

    res.send(data);

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}