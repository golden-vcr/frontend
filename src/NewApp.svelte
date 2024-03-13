<main>
  <h1>Hello, this is an H1</h1>
  <p>This is the text of an h1.</p>
  <div class="card">
    <h2>Hello, this is an H2</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum lacinia felis vel varius. Nulla sit amet leo quis lacus convallis vestibulum eget ut diam. Aenean non nisl diam. Maecenas id congue purus, a pellentesque tellus.</p>
    <div class="swatches">
      <div class="swatch sw-darkgrey">darkgrey</div>
      <div class="swatch sw-grey">grey</div>
      <div class="swatch sw-blue">blue</div>
      <div class="swatch sw-gold">gold</div>
      <div class="swatch sw-offwhite">offwhite</div>
    </div>
    <p>Nunc eget purus lacus. Nunc turpis dui, egestas vel velit vel, euismod malesuada magna. Donec porttitor nunc vel purus tempor mollis. Nulla dui quam, lobortis dictum viverra id, auctor a sapien. Etiam eu tellus eu sapien fringilla accumsan et sit amet arcu. Cras libero felis, vehicula a lacinia sed, sodales eu nulla. Cras lacus mi, sodales non iaculis elementum, volutpat quis diam. Morbi dapibus rutrum semper. Nunc at quam neque. Aliquam nec purus ac mi posuere malesuada.</p>
    <p>Please clicky butan:</p>
    <button>Clicky ples</button>
    <p>If no clicky butan, instead please go hell.</p>
  </div>
  <div class="card">
    <h3>Do stuff</h3>
    <form>
      <fieldset>
        <label for="name">Name</label>
        <input id="name" type="text" value="John J. Johnson" />
      </fieldset>
      <fieldset>
        <label for="age">Age</label>
        <input id="age" type="text" value="Gettin' on in years" />
      </fieldset>
      <fieldset>
        <label for="bald">Bald?</label>
        <input id="bald" type="checkbox" />
      </fieldset>
      <fieldset>
        <label for="state">State</label>
        <select>
          <option value="al">Alabama</option>
          <option value="ms">Mississippi</option>
          <option value="other">Other</option>
        </select>
      </fieldset>
      <input type="submit" />
    </form>
  </div>
  <div class="card">
    <img src="https://golden-vcr-images.nyc3.digitaloceanspaces.com/0276_thumb.jpg" alt="Thumbnail" />
    <p>Viking 400/500 Video Handbook</p>
  </div>
</main>

<style>
  .swatches {
    flex-direction: row;
    gap: 0;
    border: 1px solid #ccc;
    padding: 0.25rem;
  }
  .swatch {
    width: 64px;
    height: 64px;
    align-items: center;
    justify-content: end;
    font-size: 0.75rem;
  }
  .sw-darkgrey {
    background-color: #181818;
  }
  .sw-grey {
    background-color: #242424;
  }
  .sw-blue {
    background-color: #1158b6;
  }
  .sw-gold {
    background-color: #efbf2d;
  }
  .sw-offwhite {
    background-color: #e1e1e1;
  }
  .sw-gold, .sw-offwhite {
    color: #181818;
  }
</style>