namespace moodifyApi.Repository.Interface
{
    public interface IRepositoryBase<TEntity> : IDisposable where TEntity : class
    {
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task <TEntity?> GetByIdAsync(int id);
        Task<object> AddAsync (TEntity objeto);
        Task Update (TEntity entity);
        Task DeleteIdAsync (int id);
        Task Delete (TEntity entity);
    }
}
