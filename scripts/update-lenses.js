const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const updates = [
    {
      type: "SINGLE_VISION",
      name: "Frame Only (Demo Clear Lenses)",
      features: "Clear Demo Acrylic,Zero Prescription Power,Original Brand Cut",
      isActive: true,
      price: 0,
      description: "Standard clear display lenses without vision power. Perfect if you have your own local optician.",
    },
    {
      type: "BLUE_LIGHT",
      name: "Blue Cut / Computer Screen Lenses",
      features: "99.8% Blue Light Cut,UV400 Protection,Anti-Scratch Coat,Digital Screen Comfort,Eliminates Headaches",
      isActive: true,
      price: 1500,
      description: "Blocks harmful blue wavelengths emitted by smartphones, laptops, and LED screens. Recommended for 5+ hours daily screen use.",
    },
    {
      type: "ANTI_GLARE",
      name: "Anti-Glare High Clarity AR Lenses",
      features: "Night Driving Anti-Reflective,Hydrophobic Smudge Free,Anti-Static Dust Shield,Crystal Clear Transparency",
      isActive: true,
      price: 1200,
      description: "Green/blue anti-reflective multi-coating that eliminates headlight glare during night driving and overhead fluorescent light reflections.",
    },
    {
      type: "PHOTOCHROMIC",
      name: "Photochromic / Transition Lenses",
      features: "Fast Sun-Adaptive Transition,Darkens to Sunglasses in Sunlight,100% Clear Indoors,UV400 Defense,2-in-1 Eyeglasses & Sunglasses",
      isActive: true,
      price: 3500,
      description: "Magic light-adaptive lenses that remain crystal clear indoors, and automatically transition into deep dark sunglasses under UV sunlight.",
    },
    {
      type: "PROGRESSIVE",
      name: "Progressive Multi-Focal (No Line)",
      features: "Smooth No-Line Multi-Focal,Clear Distance Reading & Computer Zones,Wide Corridor Distortion-Free,Seamless Aesthetic",
      isActive: true,
      price: 6500,
      description: "Advanced digital freeform lenses combining distance, intermediate computer, and close reading vision into one seamless lens without visible lines.",
    },
    {
      type: "BIFOCAL",
      name: "Bifocal Lenses (With Reading Line)",
      features: "Distinct Reading Segment Line,Dual Vision Distance & Reading,Easy Focus Switching,Budget-Friendly Multi-Vision",
      isActive: true,
      price: 3000,
      description: "Traditional dual-vision lenses with a distinct D-segment reading line at the bottom for close book reading and upper area for distance.",
    },
  ];

  for (const u of updates) {
    const existing = await prisma.lensOption.findFirst({ where: { type: u.type } });
    if (existing) {
      await prisma.lensOption.update({
        where: { id: existing.id },
        data: {
          name: u.name,
          features: u.features,
          isActive: u.isActive,
          price: u.price,
          description: u.description,
        },
      });
    } else {
      await prisma.lensOption.create({
        data: {
          name: u.name,
          type: u.type,
          price: u.price,
          description: u.description,
          features: u.features,
          isActive: u.isActive,
        },
      });
    }
  }

  console.log("Successfully updated and standardized all 6 lens options in database!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
