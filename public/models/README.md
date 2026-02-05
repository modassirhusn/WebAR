# 3D Models Folder

Place your `.glb` 3D models here for AR display.

## File Naming Convention

Name your files to match the food item IDs in `src/data/foodData.ts`:

| Food ID | Expected Model File |
|---------|-------------------|
| butter-chicken | butter-chicken.glb |
| paneer-tikka | paneer-tikka.glb |
| biryani | biryani.glb |
| naan | naan.glb |
| dal-makhani | dal-makhani.glb |
| manchurian | manchurian.glb |
| fried-rice | fried-rice.glb |
| noodles | noodles.glb |
| spring-rolls | spring-rolls.glb |
| sweet-corn-soup | sweet-corn-soup.glb |
| dosa | dosa.glb |
| idli | idli.glb |
| uttapam | uttapam.glb |
| vada | vada.glb |
| pongal | pongal.glb |
| gulab-jamun | gulab-jamun.glb |
| rasmalai | rasmalai.glb |
| jalebi | jalebi.glb |
| kheer | kheer.glb |
| ice-cream | ice-cream.glb |

## Usage

Models are referenced as `/models/[filename].glb` in the app.

After adding models, update the `model` field in `src/data/foodData.ts` if needed.
