import { motion } from 'framer-motion';

export default function CategoryGrid({ categories }: { categories: any[] }) {
  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.a
              key={category.id}
              href={`/blog/category/${category.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center justify-center p-6 bg-card border rounded-2xl hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm transition-all text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors text-primary">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
              <p className="text-xs text-muted-foreground">{category.articleCount} Articles</p>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
