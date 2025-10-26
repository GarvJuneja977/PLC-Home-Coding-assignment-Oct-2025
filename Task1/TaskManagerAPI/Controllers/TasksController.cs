using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Models;
using TaskManagerAPI.Repositories;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> Get() => Ok(TaskRepository.GetAll());

        [HttpPost]
        public ActionResult<TaskItem> Post([FromBody] TaskItem task) => Ok(TaskRepository.Add(task));

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] TaskItem task)
        {
            if (!TaskRepository.Update(id, task))
                return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!TaskRepository.Delete(id))
                return NotFound();
            return NoContent();
        }
    }
}
