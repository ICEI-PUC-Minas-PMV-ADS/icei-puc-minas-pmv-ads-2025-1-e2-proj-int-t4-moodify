using Microsoft.EntityFrameworkCore;
using moodifyApi.MoodifyContext;
using moodifyApi.Repository.Interface;

namespace moodifyApi.Repository
{
    namespace MoodifyApi.Repositories
    {
        public class RepositoryBase<TEntity> : IRepositoryBase<TEntity> where TEntity : class
        {
            protected readonly MoodifyDbContext _context;

            public RepositoryBase(MoodifyDbContext context)
            {
                _context = context;
            }

            public virtual async Task<IEnumerable<TEntity>> GetAllAsync() =>
                await _context.Set<TEntity>()
                .AsNoTracking()
                .ToListAsync();

            public async Task<TEntity?> GetByIdAsync(int id) =>
                await _context.Set<TEntity>().FindAsync(id);

            public async Task<object> AddAsync(TEntity entity)
            {
                _context.Add(entity);
                await _context.SaveChangesAsync();
                return entity;
            }                

            public virtual async Task Update(TEntity entity)
            {
                _context.Entry(entity).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

            public async Task DeleteIdAsync(int id)
            {
                var entity = await GetByIdAsync(id);
                if(entity == null)
                    throw new Exception("O registro não existe na base de dados!");

               await Delete(entity);
            }

            public virtual async Task Delete(TEntity entity)
            {
                _context.Set<TEntity>().Remove(entity);

                await _context.SaveChangesAsync();
            }
            public void Dispose() =>
            _context.Dispose();
        }
    }

}
